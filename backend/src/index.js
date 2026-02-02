require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Import routes
const clubRoutes = require('./routes/clubRoutes');
const playerRoutes = require('./routes/playerRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const newsRoutes = require('./routes/newsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Health check
app.use('/health', healthRoutes);

// API Routes
app.use('/api/clubs', clubRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/feedback', feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Sportify AI server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
