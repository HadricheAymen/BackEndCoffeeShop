const { pool } = require('../config/database');

class Favorite {
  // Private fields
  #id;
  #user_id;
  #coffee_id;
  #preferred_size;
  #preferred_sugar;
  #created_at;

  /**
   * Constructor - creates Favorite instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#user_id = data.user_id;
      this.#coffee_id = data.coffee_id;
      this.#preferred_size = data.preferred_size;
      this.#preferred_sugar = data.preferred_sugar;
      this.#created_at = data.created_at;
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

  get preferred_size() {
    return this.#preferred_size;
  }

  get preferred_sugar() {
    return this.#preferred_sugar;
  }

  get created_at() {
    return this.#created_at;
  }

  // Setters for validation
  set preferred_size(value) {
    const validSizes = ['small', 'medium', 'large'];
    if (!value || validSizes.includes(value)) {
      this.#preferred_size = value;
    }
  }

  set preferred_sugar(value) {
    const validLevels = ['none', 'low', 'medium', 'high'];
    if (!value || validLevels.includes(value)) {
      this.#preferred_sugar = value;
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
      preferred_size: this.#preferred_size,
      preferred_sugar: this.#preferred_sugar,
      created_at: this.#created_at
    };
  }

  /**
   * Add coffee to favorites
   */
  static async create({ user_id, coffee_id, preferred_size, preferred_sugar }) {
    const [result] = await pool.execute(
      `INSERT INTO favorites (user_id, coffee_id, preferred_size, preferred_sugar)
       VALUES (?, ?, ?, ?)`,
      [user_id, coffee_id, preferred_size || null, preferred_sugar || null]
    );
    return result.insertId;
  }

  /**
   * Get user's favorites
   */
  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT f.*, cp.name, cp.description, cp.price, cp.average_rating,
              c.name as category_name
       FROM favorites f
       JOIN coffee_products cp ON f.coffee_id = cp.id
       LEFT JOIN categories c ON cp.category_id = c.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    // Return plain objects for backward compatibility
    return rows;
  }

  /**
   * Remove from favorites
   */
  static async delete(favoriteId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Check if coffee is in user's favorites
   */
  static async exists(userId, coffeeId) {
    const [rows] = await pool.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND coffee_id = ?',
      [userId, coffeeId]
    );
    return rows.length > 0;
  }
}

module.exports = Favorite;

