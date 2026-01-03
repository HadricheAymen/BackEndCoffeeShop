const { pool } = require('../config/database');
const Coffee = require('./Coffee');

class Review {
  // Private fields
  #id;
  #user_id;
  #coffee_id;
  #order_id;
  #rating;
  #comment;
  #created_at;
  #updated_at;

  /**
   * Constructor - creates Review instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#user_id = data.user_id;
      this.#coffee_id = data.coffee_id;
      this.#order_id = data.order_id;
      this.#rating = data.rating;
      this.#comment = data.comment;
      this.#created_at = data.created_at;
      this.#updated_at = data.updated_at;
    }
  }

  // Getters for private fields
  get id() {
    return this.#id;
  }

  get user_id() {
    return this.#user_id;
  }

  get coffee_id() {
    return this.#coffee_id;
  }

  get order_id() {
    return this.#order_id;
  }

  get rating() {
    return this.#rating;
  }

  get comment() {
    return this.#comment;
  }

  get created_at() {
    return this.#created_at;
  }

  get updated_at() {
    return this.#updated_at;
  }

  // Setters for validation
  set rating(value) {
    if (value >= 1 && value <= 5) {
      this.#rating = value;
    }
  }

  set comment(value) {
    if (!value || value.length <= 1000) {
      this.#comment = value;
    }
  }

  /**
   * Convert to plain object for backward compatibility
   */
  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      coffee_id: this.#coffee_id,
      order_id: this.#order_id,
      rating: this.#rating,
      comment: this.#comment,
      created_at: this.#created_at,
      updated_at: this.#updated_at
    };
  }

  /**
   * Create a new review
   */
  static async create({ user_id, coffee_id, order_id, rating, comment }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create review
      const [result] = await connection.execute(
        `INSERT INTO reviews (user_id, coffee_id, order_id, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, coffee_id, order_id || null, rating, comment || null]
      );

      const reviewId = result.insertId;

      // Update coffee rating
      await Coffee.updateRating(coffee_id);

      await connection.commit();
      return reviewId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get reviews for a coffee product
   */
  static async findByCoffee(coffeeId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.username, u.email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.coffee_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [coffeeId, limit, offset]
    );
    // Return plain objects for backward compatibility
    return rows;
  }

  /**
   * Get reviews by user
   */
  static async findByUser(userId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT r.*, cp.name as coffee_name, cp.description as coffee_description,
              c.name as category_name
       FROM reviews r
       JOIN coffee_products cp ON r.coffee_id = cp.id
       LEFT JOIN categories c ON cp.category_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    // Return plain objects for backward compatibility
    return rows;
  }

  /**
   * Find review by ID
   */
  static async findById(reviewId) {
    const [rows] = await pool.execute(
      `SELECT r.*, u.username, cp.name as coffee_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN coffee_products cp ON r.coffee_id = cp.id
       WHERE r.id = ?`,
      [reviewId]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }

  /**
   * Update review
   */
  static async update(reviewId, userId, { rating, comment }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get coffee_id before update
      const [reviewRows] = await connection.execute(
        'SELECT coffee_id FROM reviews WHERE id = ? AND user_id = ?',
        [reviewId, userId]
      );

      if (!reviewRows[0]) {
        throw new Error('Review not found or unauthorized');
      }

      const coffeeId = reviewRows[0].coffee_id;

      // Update review
      const updates = [];
      const params = [];

      if (rating !== undefined) {
        updates.push('rating = ?');
        params.push(rating);
      }

      if (comment !== undefined) {
        updates.push('comment = ?');
        params.push(comment);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      params.push(reviewId, userId);

      await connection.execute(
        `UPDATE reviews SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        params
      );

      // Update coffee rating
      await Coffee.updateRating(coffeeId);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete review
   */
  static async delete(reviewId, userId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get coffee_id before delete
      const [reviewRows] = await connection.execute(
        'SELECT coffee_id FROM reviews WHERE id = ? AND user_id = ?',
        [reviewId, userId]
      );

      if (!reviewRows[0]) {
        throw new Error('Review not found or unauthorized');
      }

      const coffeeId = reviewRows[0].coffee_id;

      // Delete review
      await connection.execute(
        'DELETE FROM reviews WHERE id = ? AND user_id = ?',
        [reviewId, userId]
      );

      // Update coffee rating
      await Coffee.updateRating(coffeeId);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Review;

