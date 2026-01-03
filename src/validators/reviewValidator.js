const { body, param } = require('express-validator');

const createReviewValidator = [
  body('coffee_id')
    .isInt({ min: 1 })
    .withMessage('Valid coffee ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
  body('order_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Order ID must be a valid integer')
];

const updateReviewValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid review ID is required'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters')
];

module.exports = {
  createReviewValidator,
  updateReviewValidator
};

