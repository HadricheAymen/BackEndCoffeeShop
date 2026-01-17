const express = require('express');
const router = express.Router();
const { createOrder, getOrderHistory, getOrderById, updateOrderStatus, calculateOrderPrice } = require('../controllers/orderController');
const { createOrderValidator } = require('../validators/orderValidator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     coffee_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     cup_size:
 *                       type: string
 *                       enum: [small, medium, large]
 *                     sugar_level:
 *                       type: string
 *                       enum: [none, low, medium, high]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', createOrderValidator, validate, createOrder);

/**
 * @swagger
 * /api/orders/calculate-price:
 *   post:
 *     summary: Calculate order price without creating the order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - coffee_id
 *                     - quantity
 *                     - cup_size
 *                     - sugar_level
 *                   properties:
 *                     coffee_id:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     cup_size:
 *                       type: string
 *                       enum: [small, medium, large]
 *                       example: medium
 *                     sugar_level:
 *                       type: string
 *                       enum: [none, low, medium, high]
 *                       example: low
 *     responses:
 *       200:
 *         description: Detailed pricing breakdown
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           coffee_id:
 *                             type: integer
 *                           coffee_name:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           cup_size:
 *                             type: string
 *                           sugar_level:
 *                             type: string
 *                           base_price:
 *                             type: number
 *                           size_modifier:
 *                             type: number
 *                           unit_price:
 *                             type: number
 *                           item_total:
 *                             type: number
 *                     subtotal:
 *                       type: number
 *                       example: 16.80
 *                     total_quantity:
 *                       type: integer
 *                       example: 4
 *                     discount:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                           example: 2.00
 *                         type:
 *                           type: string
 *                           enum: [quantity, value, none]
 *                           example: value
 *                     final_total:
 *                       type: number
 *                       example: 14.80
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Coffee not found or not available
 *       500:
 *         description: Server error
 */
router.post('/calculate-price', createOrderValidator, validate, calculateOrderPrice);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
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
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */
router.get('/', getOrderHistory);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
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
 *         description: Order details with items
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, completed, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.patch('/:id/status', updateOrderStatus);

module.exports = router;

