const Order = require('../models/Order');
const { pool } = require('../config/database');

/**
 * Create new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    // Create order
    const orderId = await Order.create(userId, items);

    // Get created order details
    const order = await Order.findById(orderId, userId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's order history
 */
const getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const orders = await Order.findByUser(userId, limit, offset);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          limit,
          offset,
          count: orders.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updated = await Order.updateStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate order price without creating the order
 */
const calculateOrderPrice = async (req, res, next) => {
  try {
    const { items } = req.body;

    // Calculate totals
    let subtotal = 0;
    let totalQuantity = 0;
    const itemsData = [];

    for (const item of items) {
      // Get coffee price and validate availability
      const [coffeeRows] = await pool.execute(
        'SELECT id, name, price, is_available FROM coffee_products WHERE id = ?',
        [item.coffee_id]
      );

      if (!coffeeRows[0]) {
        return res.status(404).json({
          success: false,
          message: `Coffee with ID ${item.coffee_id} not found`
        });
      }

      if (!coffeeRows[0].is_available) {
        return res.status(404).json({
          success: false,
          message: `Coffee with ID ${item.coffee_id} is not available`
        });
      }

      const coffee = coffeeRows[0];
      const basePrice = parseFloat(coffee.price);
      const sizeModifier = Order.calculateSizeModifier(item.cup_size);
      const unitPrice = parseFloat((basePrice * sizeModifier).toFixed(2));
      const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));

      subtotal += itemTotal;
      totalQuantity += item.quantity;

      itemsData.push({
        coffee_id: coffee.id,
        coffee_name: coffee.NAME || coffee.name,
        quantity: item.quantity,
        cup_size: item.cup_size,
        sugar_level: item.sugar_level,
        base_price: basePrice,
        size_modifier: sizeModifier,
        unit_price: unitPrice,
        item_total: itemTotal
      });
    }

    // Calculate discount
    const discountAmount = Order.calculateDiscount(subtotal, totalQuantity);
    const finalTotal = parseFloat((subtotal - discountAmount).toFixed(2));

    // Determine discount type
    let discountType = 'none';
    if (discountAmount > 0) {
      const quantityDiscount = totalQuantity >= 5 ? subtotal * 0.10 : 0;
      const valueDiscount = subtotal > 15 ? 2.00 : 0;
      discountType = quantityDiscount > valueDiscount ? 'quantity' : 'value';
    }

    res.json({
      success: true,
      data: {
        items: itemsData,
        subtotal: subtotal,
        total_quantity: totalQuantity,
        discount: {
          amount: discountAmount,
          type: discountType
        },
        final_total: finalTotal
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderHistory,
  getOrderById,
  updateOrderStatus,
  calculateOrderPrice
};

