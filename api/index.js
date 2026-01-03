require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../src/config/swagger');
const { errorHandler, notFoundHandler } = require('../src/middleware/errorHandler');

// Import routes
const authRoutes = require('../src/routes/authRoutes');
const categoryRoutes = require('../src/routes/categoryRoutes');
const coffeeRoutes = require('../src/routes/coffeeRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const favoriteRoutes = require('../src/routes/favoriteRoutes');
const reviewRoutes = require('../src/routes/reviewRoutes');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for Swagger UI
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Coffee Shop API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Coffee Shop API is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Coffee Shop API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      coffees: '/api/coffees',
      orders: '/api/orders',
      favorites: '/api/favorites',
      reviews: '/api/reviews'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coffees', coffeeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Export the Express app as a serverless function
module.exports = app;

