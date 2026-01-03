const { pool } = require('../config/database');

class Category {
  // Private fields
  #id;
  #name;
  #description;
  #product_count;

  /**
   * Constructor - creates Category instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#name = data.name;
      this.#description = data.description;
      this.#product_count = data.product_count;
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

  get product_count() {
    return this.#product_count;
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

  /**
   * Convert to plain object for backward compatibility
   */
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      product_count: this.#product_count
    };
  }

  /**
   * Get all categories
   */
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT c.*, COUNT(cp.id) as product_count
       FROM categories c
       LEFT JOIN coffee_products cp ON c.id = cp.category_id AND cp.is_available = TRUE
       GROUP BY c.id
       ORDER BY c.name`
    );
    // Return plain objects for backward compatibility
    return rows;
  }

  /**
   * Find category by ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }

  /**
   * Get coffees by category ID
   */
  static async getCoffeesByCategory(categoryId, limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT * FROM coffee_products
       WHERE category_id = ? AND is_available = TRUE
       ORDER BY name
       LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );
    // Return plain objects for backward compatibility
    return rows;
  }
}

module.exports = Category;

