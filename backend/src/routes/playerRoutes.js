const express = require('express');
const PlayerController = require('../controllers/PlayerController');

const router = express.Router();

// GET /api/players/search
router.get('/search', PlayerController.searchPlayers);

// GET /api/players/:player_id
router.get('/:player_id', PlayerController.getPlayer);

module.exports = router;
