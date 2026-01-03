const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coffee Shop API',
      version: '1.0.0',
      description: 'Comprehensive Node.js backend API for a coffee shop application with authentication, orders, favorites, and reviews',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            product_count: { type: 'integer' }
          }
        },
        Coffee: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category_id: { type: 'integer' },
            description: { type: 'string' },
            price: { type: 'number', format: 'decimal' },
            is_available: { type: 'boolean' },
            average_rating: { type: 'number', format: 'decimal' },
            total_reviews: { type: 'integer' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            order_number: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'] },
            total_price: { type: 'number', format: 'decimal' },
            discount_amount: { type: 'number', format: 'decimal' },
            final_price: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            coffee_id: { type: 'integer' },
            order_id: { type: 'integer' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Categories', description: 'Coffee category endpoints' },
      { name: 'Coffees', description: 'Coffee product endpoints' },
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Favorites', description: 'Favorite coffee endpoints' },
      { name: 'Reviews', description: 'Review and rating endpoints' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

