const { pool } = require('../config/database');

class Order {
  // Private fields
  #id;
  #user_id;
  #order_number;
  #status;
  #total_price;
  #discount_amount;
  #final_price;
  #created_at;
  #updated_at;
  #items;

  /**
   * Constructor - creates Order instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#user_id = data.user_id;
      this.#order_number = data.order_number;
      this.#status = data.status;
      this.#total_price = data.total_price;
      this.#discount_amount = data.discount_amount;
      this.#final_price = data.final_price;
      this.#created_at = data.created_at;
      this.#updated_at = data.updated_at;
      this.#items = data.items || [];
    }
  }

  // Getters for private fields
  get id() {
    return this.#id;
  }

  get user_id() {
    return this.#user_id;
  }

  get order_number() {
    return this.#order_number;
  }

  get status() {
    return this.#status;
  }

  get total_price() {
    return this.#total_price;
  }

  get discount_amount() {
    return this.#discount_amount;
  }

  get final_price() {
    return this.#final_price;
  }

  get created_at() {
    return this.#created_at;
  }

  get updated_at() {
    return this.#updated_at;
  }

  get items() {
    return this.#items;
  }

  // Setters for validation
  set status(value) {
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (validStatuses.includes(value)) {
      this.#status = value;
    }
  }

  set items(value) {
    if (Array.isArray(value)) {
      this.#items = value;
    }
  }

  /**
   * Convert to plain object for backward compatibility
   */
  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      order_number: this.#order_number,
      status: this.#status,
      total_price: this.#total_price,
      discount_amount: this.#discount_amount,
      final_price: this.#final_price,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
      items: this.#items
    };
  }

  /**
   * Generate next order number
   */
  static async generateOrderNumber() {
    const [rows] = await pool.execute(
      'SELECT order_number FROM orders ORDER BY id DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return 'ORD-001';
    }

    const lastNumber = parseInt(rows[0].order_number.split('-')[1]);
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `ORD-${nextNumber}`;
  }

  /**
   * Calculate cup size price modifier
   */
  static calculateSizeModifier(size) {
    const modifiers = {
      small: 1.0,
      medium: 1.2,
      large: 1.6
    };
    return modifiers[size] || 1.0;
  }

  /**
   * Calculate discount
   */
  static calculateDiscount(totalPrice, totalQuantity) {
    let discount = 0;

    // Quantity discount: 10% off for 5+ items
    const quantityDiscount = totalQuantity >= 5 ? totalPrice * 0.10 : 0;

    // Value discount: $2 off for orders over $15
    const valueDiscount = totalPrice > 15 ? 2.00 : 0;

    // Apply whichever is greater
    discount = Math.max(quantityDiscount, valueDiscount);

    return parseFloat(discount.toFixed(2));
  }

  /**
   * Create new order with items
   */
  static async create(userId, items) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      let totalPrice = 0;
      let totalQuantity = 0;
      const orderItems = [];

      for (const item of items) {
        // Get coffee price
        const [coffeeRows] = await connection.execute(
          'SELECT price, is_available FROM coffee_products WHERE id = ?',
          [item.coffee_id]
        );

        if (!coffeeRows[0]) {
          throw new Error(`Coffee with ID ${item.coffee_id} not found`);
        }

        if (!coffeeRows[0].is_available) {
          throw new Error(`Coffee with ID ${item.coffee_id} is not available`);
        }

        const basePrice = parseFloat(coffeeRows[0].price);
        const sizeModifier = this.calculateSizeModifier(item.cup_size);
        const unitPrice = parseFloat((basePrice * sizeModifier).toFixed(2));
        const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));

        totalPrice += itemTotal;
        totalQuantity += item.quantity;

        orderItems.push({
          ...item,
          unit_price: unitPrice,
          item_total: itemTotal
        });
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(totalPrice, totalQuantity);
      const finalPrice = parseFloat((totalPrice - discountAmount).toFixed(2));

      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (user_id, order_number, total_price, discount_amount, final_price) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, orderNumber, totalPrice, discountAmount, finalPrice]
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of orderItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, coffee_id, quantity, cup_size, sugar_level, unit_price, item_total)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.coffee_id, item.quantity, item.cup_size, item.sugar_level, item.unit_price, item.item_total]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get order by ID with items
   */
  static async findById(orderId, userId = null) {
    let query = `
      SELECT o.*, u.username, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    const params = [orderId];

    if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }

    const [orderRows] = await pool.execute(query, params);

    if (!orderRows[0]) {
      return null;
    }

    const order = orderRows[0];

    // Get order items
    const [itemRows] = await pool.execute(
      `SELECT oi.*, cp.name as coffee_name, cp.description as coffee_description
       FROM order_items oi
       JOIN coffee_products cp ON oi.coffee_id = cp.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    order.items = itemRows;
    return order;
  }

  /**
   * Get user's order history with pagination
   */
  static async findByUser(userId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId, status) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Order;

