const Club = require('../models/Club');
const RecommendationService = require('../services/RecommendationService');
const logger = require('../utils/logger');

/**
 * Club Controller
 */
class ClubController {
  /**
   * POST /api/clubs/needs
   * Create or update club needs profile
   */
  static async setClubNeeds(req, res) {
    try {
      const { club_id } = req.params;
      const needsData = req.body;

      // Validate required fields
      if (!needsData.positions_required || !Array.isArray(needsData.positions_required)) {
        return res.status(400).json({
          status: 'error',
          message: 'positions_required must be a non-empty array'
        });
      }

      const needs = await Club.upsertNeedsProfile(club_id, needsData);

      return res.status(201).json({
        status: 'success',
        data: needs,
        message: 'Club needs profile created/updated'
      });
    } catch (error) {
      logger.error(`Error setting club needs: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create club needs profile'
      });
    }
  }

  /**
   * GET /api/clubs/:club_id/needs
   * Get club needs profile
   */
  static async getClubNeeds(req, res) {
    try {
      const { club_id } = req.params;
      const needs = await Club.getNeedsProfile(club_id);

      return res.json({
        status: 'success',
        data: needs
      });
    } catch (error) {
      logger.error(`Error fetching club needs: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch club needs'
      });
    }
  }

  /**
   * GET /api/clubs/:club_id
   * Get club details
   */
  static async getClub(req, res) {
    try {
      const { club_id } = req.params;
      const club = await Club.getById(club_id);

      if (!club) {
        return res.status(404).json({
          status: 'error',
          message: 'Club not found'
        });
      }

      return res.json({
        status: 'success',
        data: club
      });
    } catch (error) {
      logger.error(`Error fetching club: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch club'
      });
    }
  }
}

module.exports = ClubController;
