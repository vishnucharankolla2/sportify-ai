const express = require('express');
const ClubController = require('../controllers/ClubController');

const router = express.Router();

// POST /api/clubs/:club_id/needs
router.post('/:club_id/needs', ClubController.setClubNeeds);

// GET /api/clubs/:club_id/needs
router.get('/:club_id/needs', ClubController.getClubNeeds);

// GET /api/clubs/:club_id
router.get('/:club_id', ClubController.getClub);

module.exports = router;
