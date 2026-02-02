const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Player Model - Handles all player database operations
 */
class Player {
  static async getById(id) {
    const result = await db.query(
      `SELECT p.*, json_agg(json_build_object('type', ps.signal_type, 'value', ps.signal_value, 'confidence', ps.confidence_score)) as signals
       FROM players p
       LEFT JOIN player_signals ps ON p.id = ps.player_id AND ps.is_active = true
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );
    return result.rows[0];
  }

  static async getByExternalId(externalId) {
    const result = await db.query(
      'SELECT * FROM players WHERE external_id = $1',
      [externalId]
    );
    return result.rows[0];
  }

  static async searchByPosition(position, limit = 100) {
    const result = await db.query(
      `SELECT * FROM players 
       WHERE (primary_position = $1 OR $1 = ANY(secondary_positions))
       AND is_available = true
       LIMIT $2`,
      [position, limit]
    );
    return result.rows;
  }

  static async searchByClub(clubId) {
    const result = await db.query(
      'SELECT * FROM players WHERE current_club_id = $1 ORDER BY full_name ASC',
      [clubId]
    );
    return result.rows;
  }

  static async create(playerData) {
    const {
      external_id, first_name, last_name, full_name, date_of_birth,
      nationality, primary_position, secondary_positions, preferred_foot,
      height_cm, weight_kg, market_value_eur, contract_end_date, current_club_id
    } = playerData;

    const result = await db.query(
      `INSERT INTO players 
       (external_id, first_name, last_name, full_name, date_of_birth, nationality,
        primary_position, secondary_positions, preferred_foot, height_cm, weight_kg,
        market_value_eur, contract_end_date, current_club_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [external_id, first_name, last_name, full_name, date_of_birth, nationality,
       primary_position, secondary_positions || [], preferred_foot, height_cm, weight_kg,
       market_value_eur, contract_end_date, current_club_id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const allowedFields = [
      'first_name', 'last_name', 'full_name', 'nationality', 'primary_position',
      'secondary_positions', 'preferred_foot', 'height_cm', 'weight_kg',
      'market_value_eur', 'contract_end_date', 'contract_status', 'current_club_id', 'is_available'
    ];

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE players SET ${fields.join(', ')}, last_updated = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getPerformance(playerId, season = null) {
    const result = await db.query(
      `SELECT * FROM player_performance 
       WHERE player_id = $1 ${season ? 'AND season = $2' : ''}
       ORDER BY season DESC`,
      season ? [playerId, season] : [playerId]
    );
    return result.rows;
  }
}

module.exports = Player;
