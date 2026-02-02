const express = require('express');
const NewsController = require('../controllers/NewsController');

const router = express.Router();

// GET /api/news
router.get('/', NewsController.getNews);

// GET /api/news/:article_id
router.get('/:article_id', NewsController.getNewsDetail);

module.exports = router;
