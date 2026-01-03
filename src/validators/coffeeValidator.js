const { body } = require('express-validator');

/**
 * Validator for calculate price endpoint
 */
const calculatePriceValidator = [
  body('coffee_id')
    .notEmpty()
    .withMessage('Coffee ID is required')
    .isInt({ min: 1 })
    .withMessage('Coffee ID must be a positive integer'),
  
  body('cup_size')
    .notEmpty()
    .withMessage('Cup size is required')
    .isIn(['small', 'medium', 'large'])
    .withMessage('Cup size must be exactly one of: small, medium, large')
];

module.exports = {
  calculatePriceValidator
};

