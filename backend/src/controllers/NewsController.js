const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * News Controller
 */
class NewsController {
  /**
   * GET /api/news
   * Get recent football news
   */
  static async getNews(req, res) {
    try {
      const { entity_id, entity_type = 'player', limit = 50 } = req.query;

      let query = `SELECT na.*, 
                          json_agg(json_build_object('event_type', ne.event_type, 'confidence', ne.confidence_score)) as extractions
                   FROM news_articles na
                   LEFT JOIN news_extractions ne ON na.id = ne.article_id`;

      const params = [];

      if (entity_id && entity_type === 'player') {
        query += ` WHERE $1 = ANY(ne.affected_players)`;
        params.push(entity_id);
      } else if (entity_id && entity_type === 'club') {
        query += ` WHERE $1 = ANY(ne.affected_clubs)`;
        params.push(entity_id);
      }

      query += ` GROUP BY na.id
                 ORDER BY na.published_at DESC
                 LIMIT ${params.length ? '$2' : '$1'}`;
      
      params.push(limit);

      const result = await db.query(query, params);

      return res.json({
        status: 'success',
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error(`Error fetching news: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch news'
      });
    }
  }

  /**
   * GET /api/news/:article_id
   * Get news article with extraction details
   */
  static async getNewsDetail(req, res) {
    try {
      const { article_id } = req.params;

      const articleResult = await db.query(
        'SELECT * FROM news_articles WHERE id = $1',
        [article_id]
      );

      if (!articleResult.rows[0]) {
        return res.status(404).json({
          status: 'error',
          message: 'Article not found'
        });
      }

      const extractionResult = await db.query(
        'SELECT * FROM news_extractions WHERE article_id = $1',
        [article_id]
      );

      return res.json({
        status: 'success',
        data: {
          article: articleResult.rows[0],
          extractions: extractionResult.rows
        }
      });
    } catch (error) {
      logger.error(`Error fetching news detail: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch article details'
      });
    }
  }
}

module.exports = NewsController;
