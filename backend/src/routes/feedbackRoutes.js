const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');

const router = express.Router();

// POST /api/feedback
router.post('/', FeedbackController.submitFeedback);

// GET /api/feedback/:club_id
router.get('/:club_id', FeedbackController.getFeedback);

module.exports = router;
