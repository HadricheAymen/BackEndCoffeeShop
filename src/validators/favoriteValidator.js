const { body } = require('express-validator');

const addFavoriteValidator = [
  body('coffee_id')
    .isInt({ min: 1 })
    .withMessage('Valid coffee ID is required'),
  body('preferred_size')
    .optional()
    .isIn(['small', 'medium', 'large'])
    .withMessage('Preferred size must be small, medium, or large'),
  body('preferred_sugar')
    .optional()
    .isIn(['none', 'low', 'medium', 'high'])
    .withMessage('Preferred sugar must be none, low, medium, or high')
];

module.exports = {
  addFavoriteValidator
};

