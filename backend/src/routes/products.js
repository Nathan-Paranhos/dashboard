const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct 
} = require('../controllers/productController');

// @route   POST api/products
// @desc    Criar um produto
// @access  Private (Admin)
router.post('/', 
  [
    authenticateToken,
    authorizeRole('admin'),
    check('name', 'O nome é obrigatório').not().isEmpty(),
    check('category', 'A categoria é obrigatória').not().isEmpty(),
    check('price', 'O preço é obrigatório e deve ser um número').isNumeric(),
    check('stock', 'O estoque é obrigatório e deve ser um inteiro').isInt()
  ], 
  createProduct
);

// @route   GET api/products
// @desc    Obter todos os produtos
// @access  Public
router.get('/', getAllProducts);

// @route   GET api/products/:id
// @desc    Obter um produto por ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT api/products/:id
// @desc    Atualizar um produto
// @access  Private (Admin)
router.put('/:id', [authenticateToken, authorizeRole('admin')], updateProduct);

// @route   DELETE api/products/:id
// @desc    Deletar um produto
// @access  Private (Admin)
router.delete('/:id', [authenticateToken, authorizeRole('admin')], deleteProduct);

module.exports = router;
