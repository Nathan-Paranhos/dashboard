const express = require('express');
const router = express.Router();
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSaleStatus,
  deleteSale,
} = require('../controllers/saleController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Proteger todas as rotas de vendas
router.use(authenticateToken);

router.route('/')
  .post(authorizeRole('admin', 'vendedor'), createSale)
  .get(authorizeRole('admin', 'vendedor'), getAllSales);

router.route('/:id')
  .get(authorizeRole('admin', 'vendedor'), getSaleById)
  .delete(authorizeRole('admin'), deleteSale);

router.route('/:id/status')
  .put(authorizeRole('admin'), updateSaleStatus);

module.exports = router;
