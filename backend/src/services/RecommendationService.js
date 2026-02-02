const db = require('../config/database');
const Player = require('../models/Player');
const logger = require('../utils/logger');

/**
 * Recommendation & Ranking Engine
 * Implements the two-step matching process: filtering + ranking
 */
class RecommendationService {
  /**
   * Generate recommendations for a club
   */
  async generateRecommendations(clubNeed, topN = 20) {
    try {
      // Step 1: Candidate Filtering
      const candidates = await this._filterCandidates(clubNeed);
      logger.info(`Found ${candidates.length} candidates after filtering`);

      // Step 2: Ranking with scoring
      const ranked = await this._rankCandidates(candidates, clubNeed);
      const topRecommendations = ranked.slice(0, topN);

      // Step 3: Generate explanations
      const recommendations = await Promise.all(
        topRecommendations.map(async (rec, index) => ({
          ...rec,
          rank_position: index + 1,
          explanation: await this._generateExplanation(rec, clubNeed)
        }))
      );

      return recommendations;
    } catch (error) {
      logger.error(`Recommendation generation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Step 1: Filter candidates based on hard constraints
   */
  async _filterCandidates(clubNeed) {
    const {
      positions_required,
      age_min,
      age_max,
      budget_min_eur,
      budget_max_eur,
      contract_preference,
      preferred_foot
    } = clubNeed;

    let query = `
      SELECT p.*, 
             COALESCE(pp.form_score, 0.5) as form_score,
             COALESCE(pp.consistency_score, 0.5) as consistency_score
      FROM players p
      LEFT JOIN player_performance pp ON p.id = pp.player_id 
        AND pp.season = (SELECT CONCAT(YEAR(NOW()), '/', YEAR(NOW())+1))
      WHERE p.is_available = true
    `;

    const params = [];

    // Position filter
    if (positions_required && positions_required.length > 0) {
      query += ` AND (p.primary_position = ANY($${params.length + 1}) 
                 OR (p.secondary_positions && $${params.length + 1}::text[]))`;
      params.push(positions_required);
    }

    // Age filter
    if (age_min !== null && age_min !== undefined) {
      query += ` AND p.age >= $${params.length + 1}`;
      params.push(age_min);
    }
    if (age_max !== null && age_max !== undefined) {
      query += ` AND p.age <= $${params.length + 1}`;
      params.push(age_max);
    }

    // Budget filter
    if (budget_max_eur) {
      query += ` AND p.market_value_eur <= $${params.length + 1}`;
      params.push(budget_max_eur);
    }

    // Preferred foot
    if (preferred_foot) {
      query += ` AND (p.preferred_foot = $${params.length + 1} OR p.preferred_foot = 'both')`;
      params.push(preferred_foot);
    }

    query += ` LIMIT 500`;

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Step 2: Rank filtered candidates with multi-factor scoring
   */
  async _rankCandidates(candidates, clubNeed) {
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const scores = await this._calculateScores(candidate, clubNeed);
        return {
          ...candidate,
          ...scores,
          final_score: this._calculateFinalScore(scores)
        };
      })
    );

    return scoredCandidates.sort((a, b) => b.final_score - a.final_score);
  }

  /**
   * Calculate individual scoring components
   */
  async _calculateScores(player, clubNeed) {
    const fitScore = this._calculateFitScore(player, clubNeed);
    const performanceScore = player.form_score || 0.5;
    const availabilityScore = await this._calculateAvailabilityScore(player);
    const riskPenalty = await this._calculateRiskPenalty(player);
    const newsConfidence = await this._getNewsConfidence(player);

    return {
      fit_score: fitScore,
      performance_score: performanceScore,
      availability_score: availabilityScore,
      risk_penalty: riskPenalty,
      news_confidence: newsConfidence,
      positions_required: clubNeed.positions_required,
      age_min: clubNeed.age_min,
      age_max: clubNeed.age_max,
      budget_min_eur: clubNeed.budget_min_eur,
      budget_max_eur: clubNeed.budget_max_eur
    };
  }

  /**
   * Fit Score: Position, age, role compatibility
   */
  _calculateFitScore(player, clubNeed) {
    let score = 0;
    let factors = 0;

    // Position fit (0.4 weight)
    if (clubNeed.positions_required.includes(player.primary_position)) {
      score += 0.4;
    } else if (player.secondary_positions?.includes(clubNeed.positions_required[0])) {
      score += 0.35;
    }
    factors += 0.4;

    // Age fit (0.3 weight)
    if (player.age >= (clubNeed.age_min || 0) && 
        player.age <= (clubNeed.age_max || 40)) {
      score += 0.3;
    } else {
      score += Math.max(0, 0.3 * (1 - Math.abs(player.age - clubNeed.age_max) / 10));
    }
    factors += 0.3;

    // Budget fit (0.2 weight)
    if (player.market_value_eur <= (clubNeed.budget_max_eur || Infinity)) {
      score += 0.2;
    }
    factors += 0.2;

    // Preferred foot (0.1 weight)
    if (!clubNeed.preferred_foot || player.preferred_foot === clubNeed.preferred_foot || player.preferred_foot === 'both') {
      score += 0.1;
    }
    factors += 0.1;

    return Math.min(1, score / factors);
  }

  /**
   * Availability Score: Based on injury, suspension, contract status
   */
  async _calculateAvailabilityScore(player) {
    const result = await db.query(
      `SELECT signal_value, signal_type FROM player_signals 
       WHERE player_id = $1 AND is_active = true AND signal_type IN ('injury', 'suspension')
       AND expires_at > NOW()`,
      [player.id]
    );

    let penalty = 0;
    for (const signal of result.rows) {
      penalty += signal.signal_value * 0.3; // Max 30% penalty per signal
    }

    return Math.max(0, 1 - penalty);
  }

  /**
   * Risk Penalty: Injury, suspension, disciplinary history
   */
  async _calculateRiskPenalty(player) {
    const result = await db.query(
      `SELECT COUNT(*) as count, AVG(signal_value) as avg_risk
       FROM player_signals 
       WHERE player_id = $1 AND is_risk = true AND is_active = true`,
      [player.id]
    );

    const { count, avg_risk } = result.rows[0];
    return Math.min(0.4, (parseInt(count) * 0.1) + ((avg_risk || 0) * 0.2));
  }

  /**
   * News Confidence: Based on recent signal extraction confidence
   */
  async _getNewsConfidence(player) {
    const result = await db.query(
      `SELECT AVG(confidence_score) as avg_confidence
       FROM news_extractions ne
       JOIN news_articles na ON ne.article_id = na.id
       WHERE $1 = ANY(ne.affected_players)
       AND na.published_at > NOW() - INTERVAL '7 days'`,
      [player.id]
    );

    return result.rows[0]?.avg_confidence || 0.5;
  }

  /**
   * Final Score Calculation
   * Weighted combination of all factors
   */
  _calculateFinalScore(scores) {
    const weights = {
      fit_score: 0.35,
      performance_score: 0.25,
      availability_score: 0.20,
      news_confidence: 0.15,
      risk_penalty: 0.05 // Subtractive
    };

    return (
      (scores.fit_score * weights.fit_score) +
      (scores.performance_score * weights.performance_score) +
      (scores.availability_score * weights.availability_score) +
      (scores.news_confidence * weights.news_confidence) -
      (scores.risk_penalty * weights.risk_penalty)
    );
  }

  /**
   * Generate explanation for recommendation
   */
  async _generateExplanation(recommendation, clubNeed) {
    const topReasons = [
      `Position match: ${recommendation.primary_position}`,
      `Age fit: ${recommendation.age} (target: ${clubNeed.age_min}-${clubNeed.age_max})`,
      `Recent form score: ${(recommendation.performance_score * 100).toFixed(0)}%`,
      `Market value: €${recommendation.market_value_eur?.toLocaleString() || 'N/A'}`
    ];

    const signals = await db.query(
      `SELECT signal_type, signal_value, evidence, created_at 
       FROM player_signals 
       WHERE player_id = $1 AND is_active = true
       ORDER BY created_at DESC LIMIT 5`,
      [recommendation.id]
    );

    const risks = signals.rows
      .filter(s => s.signal_type === 'injury' || s.signal_type === 'suspension')
      .map(s => `${s.signal_type.charAt(0).toUpperCase() + s.signal_type.slice(1)}: ${s.evidence}`);

    return {
      top_reasons: topReasons,
      stats_evidence: {
        fit_score: (recommendation.fit_score * 100).toFixed(0),
        performance_score: (recommendation.performance_score * 100).toFixed(0),
        availability_score: (recommendation.availability_score * 100).toFixed(0)
      },
      recent_signals: signals.rows.map(s => ({
        type: s.signal_type,
        timestamp: s.created_at,
        evidence: s.evidence
      })),
      risk_indicators: risks,
      recommendation_timestamp: new Date().toISOString()
    };
  }
}

module.exports = new RecommendationService();
