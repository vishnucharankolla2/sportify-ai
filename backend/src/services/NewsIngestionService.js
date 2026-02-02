const axios = require('axios');
const logger = require('../utils/logger');
const NewsModel = require('../models/News');
const LLMService = require('./LLMService');

/**
 * News Ingestion Service
 * Fetches football news from various sources
 */
class NewsIngestionService {
  constructor() {
    this.sources = [
      {
        name: 'ESPN',
        url: 'https://www.espn.com/soccer/news',
        parser: this._parseESPN.bind(this),
        language: 'en'
      },
      {
        name: 'Sky Sports',
        url: 'https://www.skysports.com/football/news',
        parser: this._parseSkySpports.bind(this),
        language: 'en'
      },
      {
        name: 'Goal.com',
        url: 'https://www.goal.com/en',
        parser: this._parseGoal.bind(this),
        language: 'en'
      }
    ];

    this.refreshInterval = (parseInt(process.env.NEWS_INGEST_INTERVAL_MINUTES) || 60) * 60 * 1000;
  }

  /**
   * Start automated news ingestion
   */
  startAutoIngest() {
    logger.info(`🔄 News ingestion started (interval: ${this.refreshInterval / 60000} minutes)`);

    // Initial ingest
    this.ingestAllNews();

    // Scheduled ingestion
    setInterval(() => {
      this.ingestAllNews();
    }, this.refreshInterval);
  }

  /**
   * Ingest news from all sources
   */
  async ingestAllNews() {
    try {
      for (const source of this.sources) {
        await this.ingestFromSource(source);
      }
      logger.info('✓ News ingestion cycle completed');
    } catch (error) {
      logger.error(`News ingestion error: ${error.message}`);
    }
  }

  /**
   * Ingest from single source
   */
  async ingestFromSource(source) {
    try {
      logger.info(`📰 Ingesting from ${source.name}...`);

      const articles = await this._fetchArticles(source);
      
      for (const article of articles) {
        // Store article
        const storedArticle = await NewsModel.createArticle({
          ...article,
          source_name: source.name,
          original_language: source.language
        });

        // Extract signals via LLM
        const extraction = await LLMService.extractSignalsFromNews(article, source.language);

        if (extraction.success) {
          await NewsModel.createExtraction(storedArticle.id, extraction);
          logger.info(`✓ Processed: ${article.title}`);
        }
      }

      logger.info(`✓ ${source.name}: Ingested ${articles.length} articles`);
    } catch (error) {
      logger.warn(`Failed to ingest from ${source.name}: ${error.message}`);
    }
  }

  /**
   * Fetch articles with fallback mock data for MVP
   */
  async _fetchArticles(source) {
    try {
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Sportify-AI/1.0 (+https://sportify.ai)'
        }
      });

      return source.parser(response.data);
    } catch (error) {
      logger.warn(`Failed to fetch from ${source.url}: ${error.message}`);
      return this._getMockArticles(source);
    }
  }

  /**
   * Mock article data for MVP (replace with real parsing)
   */
  _getMockArticles(source) {
    return [
      {
        external_id: `mock-${Date.now()}-1`,
        title: 'Haaland ruled out for 3 weeks due to hamstring injury',
        content: 'Manchester City confirmed that Erling Haaland will miss the next 3 weeks with a hamstring injury sustained in training. The Norwegian striker is expected to return after the international break.',
        published_at: new Date(),
        author: 'Sport Reporter',
        image_url: 'https://example.com/haaland.jpg'
      },
      {
        external_id: `mock-${Date.now()}-2`,
        title: 'Chelsea close to signing Brighton defender',
        content: 'Chelsea has agreed a deal with Brighton & Hove Albion to sign defender Moisés Caicedo. The transfer fee is reported at €80 million with contract terms agreed. Medical tests scheduled for this week.',
        published_at: new Date(),
        author: 'Transfer Correspondent',
        image_url: 'https://example.com/caicedo.jpg'
      },
      {
        external_id: `mock-${Date.now()}-3`,
        title: 'Liverpool extend Salah contract through 2026',
        content: 'Liverpool FC has confirmed Mohamed Salah has signed a new contract extension through June 2026. The Egyptian winger expressed his commitment to the club with improved wages.',
        published_at: new Date(),
        author: 'Club News',
        image_url: 'https://example.com/salah.jpg'
      }
    ];
  }

  _parseESPN(html) {
    // Placeholder - real implementation would parse ESPN HTML
    return [];
  }

  _parseSkySpports(html) {
    // Placeholder - real implementation would parse Sky Sports HTML
    return [];
  }

  _parseGoal(html) {
    // Placeholder - real implementation would parse Goal.com HTML
    return [];
  }
}

module.exports = new NewsIngestionService();
