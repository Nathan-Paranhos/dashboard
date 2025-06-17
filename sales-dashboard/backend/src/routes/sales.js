const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       required:
 *         - products
 *         - total
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *         total:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           default: pending
 */
const {
    createSale,
    getSales,
    getSaleById,
    updateSaleStatus
} = require('../controllers/saleController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { validateSale } = require('../validators/saleValidator');

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, validateSale, createSale);
/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales for the logged-in user
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sales
 */
router.get('/', authenticateToken, getSales);
/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get a single sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale data
 *       404:
 *         description: Sale not found
 */
router.get('/:id', authenticateToken, getSaleById);

/**
 * @swagger
 * /sales/{id}/status:
 *   patch:
 *     summary: Update a sale's status (Admin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Sale status updated successfully
 *       404:
 *         description: Sale not found
 */
router.patch('/:id/status', authenticateToken, isAdmin, updateSaleStatus);

module.exports = router;
