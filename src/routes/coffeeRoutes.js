const express = require('express');
const router = express.Router();
const { getAllCoffees, getCoffeeById, calculatePrice } = require('../controllers/coffeeController');
const { calculatePriceValidator } = require('../validators/coffeeValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/coffees:
 *   get:
 *     summary: Get all coffees with optional filtering
 *     tags: [Coffees]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: is_available
 *         schema:
 *           type: boolean
 *           default: true
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
 *         description: List of coffees
 */
router.get('/', getAllCoffees);

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

