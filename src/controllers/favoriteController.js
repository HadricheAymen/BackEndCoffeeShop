const Favorite = require('../models/Favorite');
const Coffee = require('../models/Coffee');

/**
 * Add coffee to favorites
 */
const addFavorite = async (req, res, next) => {
  try {
    const { coffee_id, preferred_size, preferred_sugar } = req.body;
    const userId = req.user.id;

    // Check if coffee exists
    const coffee = await Coffee.findById(coffee_id);
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee not found'
      });
    }

    // Check if already in favorites
    const exists = await Favorite.exists(userId, coffee_id);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Coffee already in favorites'
      });
    }

    // Add to favorites
    const favoriteId = await Favorite.create({
      user_id: userId,
      coffee_id,
      preferred_size,
      preferred_sugar
    });

    res.status(201).json({
      success: true,
      message: 'Coffee added to favorites',
      data: {
        id: favoriteId,
        coffee_id,
        preferred_size,
        preferred_sugar
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's favorites
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findByUser(userId);

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove from favorites
 */
const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await Favorite.delete(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Coffee removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};

