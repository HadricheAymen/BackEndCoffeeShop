const { pool } = require('../config/database');

class Coffee {
  // Private fields
  #id;
  #name;
  #description;
  #price;
  #category_id;
  #is_available;
  #average_rating;
  #total_reviews;
  #category_name;

  /**
   * Constructor - creates Coffee instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#name = data.name;
      this.#description = data.description;
      this.#price = data.price;
      this.#category_id = data.category_id;
      this.#is_available = data.is_available;
      this.#average_rating = data.average_rating;
      this.#total_reviews = data.total_reviews;
      this.#category_name = data.category_name;
    }
  }

  // Getters for private fields
  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get price() {
    return this.#price;
  }

  get category_id() {
    return this.#category_id;
  }

  get is_available() {
    return this.#is_available;
  }

  get average_rating() {
    return this.#average_rating;
  }

  get total_reviews() {
    return this.#total_reviews;
  }

  get category_name() {
    return this.#category_name;
  }

  // Setters for validation
  set name(value) {
    if (value && value.length > 0) {
      this.#name = value;
    }
  }

  set description(value) {
    this.#description = value;
  }

  set price(value) {
    if (value && value > 0) {
      this.#price = value;
    }
  }

  set is_available(value) {
    this.#is_available = Boolean(value);
  }

  /**
   * Convert to plain object for backward compatibility
   */
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      price: this.#price,
      category_id: this.#category_id,
      is_available: this.#is_available,
      average_rating: this.#average_rating,
      total_reviews: this.#total_reviews,
      category_name: this.#category_name
    };
  }

  /**
   * Get all coffees with optional filtering and pagination
   */
  static async findAll({ category_id, is_available, limit = 50, offset = 0 }) {
    let query = `
      SELECT cp.*, c.name as category_name
      FROM coffee_products cp
      LEFT JOIN categories c ON cp.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND cp.category_id = ?';
      params.push(category_id);
    }

    if (is_available !== undefined) {
      query += ' AND cp.is_available = ?';
      params.push(is_available);
    }

    query += ' ORDER BY cp.name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    // Return plain objects for backward compatibility
    return rows;
  }

  /**
   * Find coffee by ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT cp.*, c.name as category_name
       FROM coffee_products cp
       LEFT JOIN categories c ON cp.category_id = c.id
       WHERE cp.id = ?`,
      [id]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }

  /**
   * Update coffee rating
   */
  static async updateRating(coffeeId) {
    await pool.execute(
      `UPDATE coffee_products
       SET average_rating = (
         SELECT COALESCE(ROUND(AVG(rating), 2), 0.00)
         FROM reviews
         WHERE coffee_id = ?
       ),
       total_reviews = (
         SELECT COUNT(*)
         FROM reviews
         WHERE coffee_id = ?
       )
       WHERE id = ?`,
      [coffeeId, coffeeId, coffeeId]
    );
  }
}

module.exports = Coffee;

