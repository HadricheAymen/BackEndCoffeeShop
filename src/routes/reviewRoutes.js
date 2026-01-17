const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByCoffee,
  getUserReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { createReviewValidator, updateReviewValidator } = require('../validators/reviewValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a review for a coffee product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coffee_id
 *               - rating
 *             properties:
 *               coffee_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *               order_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       409:
 *         description: User has already reviewed this coffee
 */
router.post('/', createReviewValidator, validate, createReview);

/**
 * @swagger
 * /api/reviews/coffee/{coffeeId}:
 *   get:
 *     summary: Get all reviews for a specific coffee
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: coffeeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of reviews for the coffee
 *       404:
 *         description: Coffee not found
 */
router.get('/coffee/:coffeeId', getReviewsByCoffee);

/**
 * @swagger
 * /api/reviews/user:
 *   get:
 *     summary: Get all reviews by the authenticated user
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of user's reviews
 */
router.get('/user', getUserReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found or unauthorized
 */
router.patch('/:id', updateReviewValidator, validate, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found or unauthorized
 */
router.delete('/:id', deleteReview);

module.exports = router;

