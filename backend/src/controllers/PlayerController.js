const Player = require('../models/Player');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Player Controller
 */
class PlayerController {
  /**
   * GET /api/players/search
   * Search players by position, club, or criteria
   */
  static async searchPlayers(req, res) {
    try {
      const { position, club_id, age_min, age_max, limit = 50 } = req.query;

      let query = 'SELECT * FROM players WHERE is_available = true';
      const params = [];
      let paramIndex = 1;

      if (position) {
        query += ` AND (primary_position = $${paramIndex} OR $${paramIndex} = ANY(secondary_positions))`;
        params.push(position);
        paramIndex++;
      }

      if (club_id) {
        query += ` AND current_club_id = $${paramIndex}`;
        params.push(club_id);
        paramIndex++;
      }

      if (age_min) {
        query += ` AND age >= $${paramIndex}`;
        params.push(age_min);
        paramIndex++;
      }

      if (age_max) {
        query += ` AND age <= $${paramIndex}`;
        params.push(age_max);
        paramIndex++;
      }

      query += ` LIMIT $${paramIndex}`;
      params.push(limit);

      const result = await db.query(query, params);

      return res.json({
        status: 'success',
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error(`Error searching players: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to search players'
      });
    }
  }

  /**
   * GET /api/players/:player_id
   * Get player details with performance metrics
   */
  static async getPlayer(req, res) {
    try {
      const { player_id } = req.params;

      const player = await Player.getById(player_id);
      if (!player) {
        return res.status(404).json({
          status: 'error',
          message: 'Player not found'
        });
      }

      const performance = await Player.getPerformance(player_id);

      return res.json({
        status: 'success',
        data: {
          player,
          performance: performance[0] || null,
          performance_history: performance
        }
      });
    } catch (error) {
      logger.error(`Error fetching player: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch player'
      });
    }
  }
}

module.exports = PlayerController;
