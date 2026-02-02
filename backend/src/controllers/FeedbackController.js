const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Feedback Controller
 */
class FeedbackController {
  /**
   * POST /api/feedback
   * Submit club feedback on recommendations
   */
  static async submitFeedback(req, res) {
    try {
      const {
        club_id,
        player_id,
        recommendation_id,
        feedback_type, // 'interested', 'not_interested', 'contacted', 'signed'
        rating, // 1-5
        comment
      } = req.body;

      if (!club_id || !player_id) {
        return res.status(400).json({
          status: 'error',
          message: 'club_id and player_id are required'
        });
      }

      const result = await db.query(
        `INSERT INTO club_feedback 
         (club_id, recommendation_id, player_id, feedback_type, rating, comment)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [club_id, recommendation_id || null, player_id, feedback_type, rating || null, comment]
      );

      // Mark recommendation as not archived but noted
      if (recommendation_id) {
        await db.query(
          `UPDATE recommendations SET expires_at = NOW() + INTERVAL '7 days'
           WHERE id = $1`,
          [recommendation_id]
        );
      }

      return res.status(201).json({
        status: 'success',
        data: result.rows[0],
        message: 'Feedback recorded'
      });
    } catch (error) {
      logger.error(`Error submitting feedback: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to submit feedback'
      });
    }
  }

  /**
   * GET /api/feedback/:club_id
   * Get feedback history for club
   */
  static async getFeedback(req, res) {
    try {
      const { club_id } = req.params;

      const result = await db.query(
        `SELECT cf.*, p.full_name, p.primary_position
         FROM club_feedback cf
         LEFT JOIN players p ON cf.player_id = p.id
         WHERE cf.club_id = $1
         ORDER BY cf.created_at DESC`,
        [club_id]
      );

      return res.json({
        status: 'success',
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error(`Error fetching feedback: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch feedback'
      });
    }
  }
}

module.exports = FeedbackController;
