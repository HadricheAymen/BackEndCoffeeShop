const Category = require('../models/Category');

/**
 * Get all categories
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get coffees by category
 */
const getCoffeesByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const coffees = await Category.getCoffeesByCategory(id, limit, offset);

    res.json({
      success: true,
      data: {
        category,
        coffees,
        pagination: {
          limit,
          offset,
          count: coffees.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCoffeesByCategory
};

