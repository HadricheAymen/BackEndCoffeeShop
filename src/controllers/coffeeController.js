const Coffee = require('../models/Coffee');
const Category = require('../models/Category');
const Order = require('../models/Order');

/**
 * Get all coffees with optional filtering (no pagination)
 */
const getAllCoffees = async (req, res, next) => {
  try {
    const is_available = req.query.is_available !== undefined ? req.query.is_available === 'true' : true;

    const coffees = await Coffee.findAll({
      is_available
    });

    res.json({
      success: true,
      data: coffees
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all coffees by category ID with optional filtering (no pagination)
 */
const getCoffeesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const is_available = req.query.is_available !== undefined ? req.query.is_available === 'true' : true;

    // Verify category exists
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get coffees for this category
    const coffees = await Coffee.findByCategory(categoryId, {
      is_available
    });

    res.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          description: category.description
        },
        coffees: coffees
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get coffee by ID
 */
const getCoffeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coffee = await Coffee.findById(id);

    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee not found'
      });
    }

    res.json({
      success: true,
      data: coffee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate price for a coffee with specific cup size
 */
const calculatePrice = async (req, res, next) => {
  try {
    const { coffee_id, cup_size } = req.body;

    // Validate coffee exists and is available
    const coffee = await Coffee.findById(coffee_id);

    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee not found'
      });
    }

    if (!coffee.is_available) {
      return res.status(404).json({
        success: false,
        message: 'Coffee is not available'
      });
    }

    // Get base price and calculate with size modifier
    const basePrice = parseFloat(coffee.price);
    const sizeModifier = Order.calculateSizeModifier(cup_size);
    const calculatedPrice = parseFloat((basePrice * sizeModifier).toFixed(2));

    res.json({
      success: true,
      data: {
        coffee_id: coffee.id,
        coffee_name: coffee.NAME || coffee.name,
        cup_size: cup_size,
        base_price: basePrice,
        size_modifier: sizeModifier,
        calculated_price: calculatedPrice
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCoffees,
  getCoffeesByCategory,
  getCoffeeById,
  calculatePrice
};

