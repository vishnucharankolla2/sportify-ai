const RecommendationService = require('../services/RecommendationService');
const Club = require('../models/Club');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Recommendation Controller
 */
class RecommendationController {
  /**
   * POST /api/recommendations
   * Generate recommendations for a club
   */
  static async generateRecommendations(req, res) {
    try {
      const { club_id, limit = 20 } = req.body;

      if (!club_id) {
        return res.status(400).json({
          status: 'error',
          message: 'club_id is required'
        });
      }

      // Get club needs
      const clubNeeds = await Club.getNeedsProfile(club_id);
      if (!clubNeeds || clubNeeds.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Club needs profile not found. Define needs first via POST /club-needs'
        });
      }

      // Generate recommendations for primary need
      const recommendations = await RecommendationService.generateRecommendations(
        clubNeeds[0],
        limit
      );

      // Store recommendations in database
      for (const rec of recommendations) {
        await db.query(
          `INSERT INTO recommendations 
           (club_id, club_need_id, player_id, rank_position, fit_score, 
            performance_score, availability_score, risk_penalty, news_confidence, 
            final_score, explanation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [club_id, clubNeeds[0].id, rec.id, rec.rank_position, rec.fit_score,
           rec.performance_score, rec.availability_score, rec.risk_penalty,
           rec.news_confidence, rec.final_score, JSON.stringify(rec.explanation)]
        );
      }

      return res.json({
        status: 'success',
        data: recommendations,
        count: recommendations.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error generating recommendations: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to generate recommendations'
      });
    }
  }

  /**
   * GET /api/recommendations/:club_id
   * Get cached recommendations for a club
   */
  static async getRecommendations(req, res) {
    try {
      const { club_id } = req.params;
      const limit = parseInt(req.query.limit) || 20;

      const result = await db.query(
        `SELECT r.*, p.full_name, p.primary_position, p.age, p.market_value_eur
         FROM recommendations r
         JOIN players p ON r.player_id = p.id
         WHERE r.club_id = $1 AND r.is_archived = false
         ORDER BY r.final_score DESC
         LIMIT $2`,
        [club_id, limit]
      );

      const recommendations = result.rows.map(r => ({
        ...r,
        explanation: typeof r.explanation === 'string' ? JSON.parse(r.explanation) : r.explanation
      }));

      return res.json({
        status: 'success',
        data: recommendations,
        count: recommendations.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error fetching recommendations: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch recommendations'
      });
    }
  }

  /**
   * GET /api/players/:player_id/signals
   * Get risk signals and news impact for a player
   */
  static async getPlayerSignals(req, res) {
    try {
      const { player_id } = req.params;

      const result = await db.query(
        `SELECT ps.*, na.title as news_source, na.published_at
         FROM player_signals ps
         LEFT JOIN news_extractions ne ON $1 = ANY(ne.affected_players)
         LEFT JOIN news_articles na ON ne.article_id = na.id
         WHERE ps.player_id = $1 AND ps.is_active = true
         ORDER BY ps.created_at DESC`,
        [player_id]
      );

      return res.json({
        status: 'success',
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error(`Error fetching player signals: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch player signals'
      });
    }
  }
}

module.exports = RecommendationController;
