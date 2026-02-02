const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Club Model
 */
class Club {
  static async getById(id) {
    const result = await db.query(
      'SELECT * FROM clubs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getByExternalId(externalId) {
    const result = await db.query(
      'SELECT * FROM clubs WHERE external_id = $1',
      [externalId]
    );
    return result.rows[0];
  }

  static async getByLeague(league) {
    const result = await db.query(
      'SELECT * FROM clubs WHERE league = $1 AND is_active = true ORDER BY name ASC',
      [league]
    );
    return result.rows;
  }

  static async create(clubData) {
    const {
      external_id, name, country, league, founded_year,
      stadium_name, official_website
    } = clubData;

    const result = await db.query(
      `INSERT INTO clubs 
       (external_id, name, country, league, founded_year, stadium_name, official_website)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [external_id, name, country, league, founded_year, stadium_name, official_website]
    );
    return result.rows[0];
  }

  static async getNeedsProfile(clubId) {
    const result = await db.query(
      'SELECT * FROM club_needs WHERE club_id = $1 AND is_active = true',
      [clubId]
    );
    return result.rows;
  }

  static async upsertNeedsProfile(clubId, needsData) {
    const {
      positions_required, age_min, age_max, budget_min_eur, budget_max_eur,
      contract_preference, preferred_foot, tactical_style, urgency_level,
      min_experience_years, role_archetypes, description
    } = needsData;

    const result = await db.query(
      `INSERT INTO club_needs 
       (club_id, positions_required, age_min, age_max, budget_min_eur, budget_max_eur,
        contract_preference, preferred_foot, tactical_style, urgency_level,
        min_experience_years, role_archetypes, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (club_id) DO UPDATE SET
       positions_required = $2, age_min = $3, age_max = $4, budget_min_eur = $5,
       budget_max_eur = $6, contract_preference = $7, preferred_foot = $8,
       tactical_style = $9, urgency_level = $10, min_experience_years = $11,
       role_archetypes = $12, description = $13, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [clubId, positions_required, age_min, age_max, budget_min_eur, budget_max_eur,
       contract_preference, preferred_foot, tactical_style, urgency_level,
       min_experience_years, role_archetypes, description]
    );
    return result.rows[0];
  }
}

module.exports = Club;
