const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const { addFavoriteValidator } = require('../validators/favoriteValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add coffee to favorites
 *     tags: [Favorites]
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
 *             properties:
 *               coffee_id:
 *                 type: integer
 *               preferred_size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               preferred_sugar:
 *                 type: string
 *                 enum: [none, low, medium, high]
 *     responses:
 *       201:
 *         description: Coffee added to favorites
 *       409:
 *         description: Coffee already in favorites
 */
router.post('/', addFavoriteValidator, validate, addFavorite);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite coffees
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite coffees
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remove coffee from favorites
 *     tags: [Favorites]
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
 *         description: Coffee removed from favorites
 *       404:
 *         description: Favorite not found
 */
router.delete('/:id', removeFavorite);

module.exports = router;

