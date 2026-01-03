const Review = require('../models/Review');
const Coffee = require('../models/Coffee');

/**
 * Create a new review
 */
const createReview = async (req, res, next) => {
  try {
    const { coffee_id, rating, comment, order_id } = req.body;
    const userId = req.user.id;

    // Check if coffee exists
    const coffee = await Coffee.findById(coffee_id);
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee not found'
      });
    }

    // Create review
    const reviewId = await Review.create({
      user_id: userId,
      coffee_id,
      order_id,
      rating,
      comment
    });

    // Get created review
    const review = await Review.findById(reviewId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    // Handle duplicate review error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this coffee'
      });
    }
    next(error);
  }
};

/**
 * Get reviews for a coffee
 */
const getReviewsByCoffee = async (req, res, next) => {
  try {
    const { coffeeId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Check if coffee exists
    const coffee = await Coffee.findById(coffeeId);
    if (!coffee) {
      return res.status(404).json({
        success: false,
        message: 'Coffee not found'
      });
    }

    const reviews = await Review.findByCoffee(coffeeId, limit, offset);

    res.json({
      success: true,
      data: {
        coffee: {
          id: coffee.id,
          name: coffee.name,
          average_rating: coffee.average_rating,
          total_reviews: coffee.total_reviews
        },
        reviews,
        pagination: {
          limit,
          offset,
          count: reviews.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's reviews
 */
const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const reviews = await Review.findByUser(userId, limit, offset);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          limit,
          offset,
          count: reviews.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a review
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    await Review.update(id, userId, { rating, comment });

    // Get updated review
    const review = await Review.findById(id);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    if (error.message === 'Review not found or unauthorized') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Delete a review
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Review.delete(id, userId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Review not found or unauthorized') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  createReview,
  getReviewsByCoffee,
  getUserReviews,
  updateReview,
  deleteReview
};

