const { pool } = require('../config/database');

class User {
  // Private fields
  #id;
  #username;
  #email;
  #password_hash;
  #created_at;
  #updated_at;

  /**
   * Constructor - creates User instance from database row
   */
  constructor(data) {
    if (data) {
      this.#id = data.id;
      this.#username = data.username;
      this.#email = data.email;
      this.#password_hash = data.password_hash;
      this.#created_at = data.created_at;
      this.#updated_at = data.updated_at;
    }
  }

  // Getters for private fields
  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }

  get email() {
    return this.#email;
  }

  get password_hash() {
    return this.#password_hash;
  }

  get created_at() {
    return this.#created_at;
  }

  get updated_at() {
    return this.#updated_at;
  }

  // Setters for validation (if needed in future)
  set username(value) {
    if (value && value.length > 0) {
      this.#username = value;
    }
  }

  set email(value) {
    if (value && value.includes('@')) {
      this.#email = value;
    }
  }

  /**
   * Convert to plain object for backward compatibility
   */
  toJSON() {
    return {
      id: this.#id,
      username: this.#username,
      email: this.#email,
      password_hash: this.#password_hash,
      created_at: this.#created_at,
      updated_at: this.#updated_at
    };
  }

  /**
   * Create a new user
   */
  static async create({ email, password_hash, username }) {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)',
      [email, password_hash, username]
    );
    return result.insertId;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }

  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    // Return plain object for backward compatibility
    return rows[0];
  }
}

module.exports = User;

