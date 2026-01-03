const express = require('express');
const router = express.Router();
const { getAllCategories, getCoffeesByCategory } = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories with product counts
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories/{id}/coffees:
 *   get:
 *     summary: Get all coffees in a specific category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of coffees in the category
 *       404:
 *         description: Category not found
 */
router.get('/:id/coffees', getCoffeesByCategory);

module.exports = router;

