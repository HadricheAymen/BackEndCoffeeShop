const { body } = require('express-validator');

const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.coffee_id')
    .isInt({ min: 1 })
    .withMessage('Valid coffee ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.cup_size')
    .isIn(['small', 'medium', 'large'])
    .withMessage('Cup size must be small, medium, or large'),
  body('items.*.sugar_level')
    .isIn(['none', 'low', 'medium', 'high'])
    .withMessage('Sugar level must be none, low, medium, or high')
];

module.exports = {
  createOrderValidator
};

