const weaviate = require('weaviate-client');
const logger = require('../utils/logger');

let client;

const initWeaviate = async () => {
  try {
    client = await weaviate.connectToLocal();
    logger.info('✓ Weaviate vector DB connected');
    return client;
  } catch (error) {
    logger.error(`Weaviate connection error: ${error.message}`);
    logger.warn('Vector embeddings will be stored in PostgreSQL fallback');
    return null;
  }
};

const getWeaviateClient = () => client;

module.exports = {
  initWeaviate,
  getWeaviateClient
};
