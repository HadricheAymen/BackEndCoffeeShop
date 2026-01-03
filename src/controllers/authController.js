const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if username is taken
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const userId = await User.create({ email, password_hash, username });

    // Generate token
    const token = generateToken({ id: userId, email, username });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userId,
          email,
          username
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};

