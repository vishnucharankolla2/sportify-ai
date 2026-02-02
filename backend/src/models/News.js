const db = require('../config/database');

/**
 * News & Extraction Model
 */
class NewsModel {
  static async createArticle(articleData) {
    const {
      external_id, title, content, original_language, source_name,
      source_url, published_at, author, image_url, raw_json
    } = articleData;

    const result = await db.query(
      `INSERT INTO news_articles 
       (external_id, title, content, original_language, source_name, source_url,
        published_at, author, image_url, raw_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (external_id) DO UPDATE SET
       title = $2, content = $3, published_at = $7
       RETURNING *`,
      [external_id, title, content, original_language, source_name, source_url,
       published_at, author, image_url, raw_json]
    );
    return result.rows[0];
  }

  static async createExtraction(articleId, extractionData) {
    const {
      event_type, confidence_score, extracted_entities, key_facts,
      evidence_snippet, affected_players, affected_clubs, llm_model, processing_time_ms
    } = extractionData;

    const result = await db.query(
      `INSERT INTO news_extractions 
       (article_id, event_type, confidence_score, extracted_entities, key_facts,
        evidence_snippet, affected_players, affected_clubs, llm_model, processing_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [articleId, event_type, confidence_score, extractionData.extracted_entities,
       extractionData.key_facts, evidence_snippet, affected_players, affected_clubs,
       llm_model, processing_time_ms]
    );
    return result.rows[0];
  }

  static async getRecentArticles(limit = 50, languagesFilter = null) {
    let query = `SELECT * FROM news_articles`;
    const params = [];

    if (languagesFilter && languagesFilter.length > 0) {
      query += ` WHERE original_language = ANY($1)`;
      params.push(languagesFilter);
    }

    query += ` ORDER BY published_at DESC LIMIT ${!languagesFilter ? '$1' : '$2'}`;
    params.push(limit);

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getExtractionsByType(eventType, limit = 100) {
    const result = await db.query(
      `SELECT ne.*, na.title, na.source_name FROM news_extractions ne
       JOIN news_articles na ON ne.article_id = na.id
       WHERE ne.event_type = $1
       ORDER BY ne.created_at DESC
       LIMIT $2`,
      [eventType, limit]
    );
    return result.rows;
  }
}

module.exports = NewsModel;
