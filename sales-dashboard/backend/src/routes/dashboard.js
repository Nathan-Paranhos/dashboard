const express = require('express')
const Sale = require('../models/Sale')
const Product = require('../models/Product')
const User = require('../models/User')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated data for dashboard visualization
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard data
 *     description: Retrieves aggregated sales data for a specified period. Accessible by all authenticated users. Admins see all data, other users see only their own.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: The time period for which to retrieve data.
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                 totalOrders:
 *                   type: number
 *                 totalCustomers:
 *                   type: number
 *                 salesData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 topProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                 topSellers:
 *                   type: array
 *                   items:
 *                     type: object
 *                 categoryData:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
// Obter dados do dashboard
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'month' } = req.query
    const userId = req.user._id
    const userRole = req.user.role

    // Definir período de data
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Filtro base para vendas
    let salesFilter = { createdAt: { $gte: startDate } }
    
    // Se não for admin, filtrar apenas vendas do usuário
    if (userRole !== 'admin') {
      salesFilter.seller = userId
    }

    // Métricas principais
    const [
      totalSales,
      totalOrders,
      totalCustomers,
      salesData,
      topProducts,
      topSellers,
      categoryData
    ] = await Promise.all([
      // Total de vendas
      Sale.aggregate([
        { $match: salesFilter },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),

      // Total de pedidos
      Sale.countDocuments(salesFilter),

      // Total de clientes únicos
      Sale.distinct('customer.email', salesFilter).then(emails => emails.length),

      // Dados de vendas por período
      Sale.aggregate([
        { $match: salesFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'day' ? '%H' : period === 'week' ? '%u' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            totalSales: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Produtos mais vendidos
      Sale.aggregate([
        { $match: salesFilter },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.totalPrice' }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            name: '$product.name',
            quantity: '$totalQuantity',
            revenue: '$totalRevenue'
          }
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 }
      ]),

      // Top vendedores (apenas para admin)
      userRole === 'admin' ? Sale.aggregate([
        { $match: salesFilter },
        {
          $group: {
            _id: '$seller',
            totalSales: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        { $unwind: '$seller' },
        {
          $project: {
            name: '$seller.name',
            totalSales: 1,
            totalOrders: 1
          }
        },
        { $sort: { totalSales: -1 } },
        { $limit: 5 }
      ]) : [],

      // Vendas por categoria
      Sale.aggregate([
        { $match: salesFilter },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            totalRevenue: { $sum: '$items.totalPrice' }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ])
    ])

    // Calcular métricas de conversão
    const previousPeriodFilter = {
      createdAt: {
        $gte: new Date(startDate.getTime() - (now.getTime() - startDate.getTime())),
        $lt: startDate
      }
    }

    if (userRole !== 'admin') {
      previousPeriodFilter.seller = userId
    }

    const previousPeriodSales = await Sale.aggregate([
      { $match: previousPeriodFilter },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])

    const currentTotal = totalSales[0]?.total || 0
    const previousTotal = previousPeriodSales[0]?.total || 0
    const growthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

    res.json({
      summary: {
        totalSales: currentTotal,
        totalOrders,
        totalCustomers,
        growthRate: parseFloat(growthRate.toFixed(2))
      },
      salesData,
      topProducts,
      topSellers,
      categoryData,
      period
    })
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

module.exports = router
