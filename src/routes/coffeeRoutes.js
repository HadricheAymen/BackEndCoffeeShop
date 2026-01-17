const express = require('express');
const router = express.Router();
const { getAllCoffees, getCoffeesByCategory, getCoffeeById, calculatePrice } = require('../controllers/coffeeController');
const { calculatePriceValidator } = require('../validators/coffeeValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/coffees:
 *   get:
 *     summary: Get all coffees with optional filtering (no pagination)
 *     tags: [Coffees]
 *     parameters:
 *       - in: query
 *         name: is_available
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by availability status
 *     responses:
 *       200:
 *         description: List of all coffees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category_id:
 *                         type: integer
 *                       category_name:
 *                         type: string
 *                       is_available:
 *                         type: boolean
 *                       average_rating:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get('/', getAllCoffees);

/**
 * @swagger
 * /api/coffees/category/{categoryId}:
 *   get:
 *     summary: Get all coffees by category ID (no pagination)
 *     tags: [Coffees]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *         example: 1
 *       - in: query
 *         name: is_available
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filter by availability status
 *     responses:
 *       200:
 *         description: List of coffees in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Espresso
 *                         description:
 *                           type: string
 *                           example: Strong and bold coffee drinks
 *                     coffees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           category_id:
 *                             type: integer
 *                           category_name:
 *                             type: string
 *                           is_available:
 *                             type: boolean
 *                           average_rating:
 *                             type: number
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/category/:categoryId', getCoffeesByCategory);

/**
 * @swagger
 * /api/coffees/calculate-price:
 *   post:
 *     summary: Calculate price for a coffee with specific cup size
 *     tags: [Coffees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coffee_id
 *               - cup_size
 *             properties:
 *               coffee_id:
 *                 type: integer
 *                 description: ID of the coffee product
 *                 example: 1
 *               cup_size:
 *                 type: string
 *                 enum: [small, medium, large]
 *                 description: Cup size (must be exactly one of small, medium, large)
 *                 example: medium
 *     responses:
 *       200:
 *         description: Calculated price with breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     coffee_id:
 *                       type: integer
 *                       example: 1
 *                     coffee_name:
 *                       type: string
 *                       example: House Blend
 *                     cup_size:
 *                       type: string
 *                       example: medium
 *                     base_price:
 *                       type: number
 *                       example: 3.50
 *                     size_modifier:
 *                       type: number
 *                       example: 1.2
 *                     calculated_price:
 *                       type: number
 *                       example: 4.20
 *       400:
 *         description: Invalid cup_size or missing fields
 *       404:
 *         description: Coffee not found or not available
 *       500:
 *         description: Server error
 */
router.post('/calculate-price', calculatePriceValidator, validate, calculatePrice);

/**
 * @swagger
 * /api/coffees/{id}:
 *   get:
 *     summary: Get coffee by ID
 *     tags: [Coffees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coffee details including average rating
 *       404:
 *         description: Coffee not found
 */
router.get('/:id', getCoffeeById);

module.exports = router;

