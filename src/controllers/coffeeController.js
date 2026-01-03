const Coffee = require('../models/Coffee');
const Order = require('../models/Order');

/**
 * Get all coffees with optional filtering
 */
const getAllCoffees = async (req, res, next) => {
  try {
    const category_id = req.query.category_id ? parseInt(req.query.category_id) : null;
    const is_available = req.query.is_available !== undefined ? req.query.is_available === 'true' : true;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const coffees = await Coffee.findAll({
      category_id,
      is_available,
      limit,
      offset
    });

    res.json({
      success: true,
      data: {
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
  getCoffeeById,
  calculatePrice
};

