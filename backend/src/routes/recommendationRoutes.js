const express = require('express');
const RecommendationController = require('../controllers/RecommendationController');

const router = express.Router();

// POST /api/recommendations
router.post('/', RecommendationController.generateRecommendations);

// GET /api/recommendations/:club_id
router.get('/:club_id', RecommendationController.getRecommendations);

// GET /api/players/:player_id/signals
router.get('/players/:player_id/signals', RecommendationController.getPlayerSignals);

module.exports = router;
