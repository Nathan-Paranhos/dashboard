const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res) => {
  const { customer, items, paymentMethod, notes } = req.body;

  try {
    // Lógica para verificar estoque e dados dos produtos seria adicionada aqui

    const sale = new Sale({
      customer,
      items,
      paymentMethod,
      notes,
      seller: req.user.id, // ID do vendedor logado
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar venda', error: error.message });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getAllSales = async (req, res) => {
  try {
    const query = {};
    // Se o usuário não for admin, ele só pode ver as próprias vendas
    if (req.user.role !== 'admin') {
      query.seller = req.user.id;
    }

    const sales = await Sale.find(query).populate('seller', 'name').populate('items.product', 'name');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar vendas', error: error.message });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('seller', 'name').populate('items.product', 'name');

    if (!sale) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    // Admin pode ver qualquer venda, vendedor só pode ver a própria
    if (req.user.role !== 'admin' && sale.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar venda', error: error.message });
  }
};

// @desc    Update sale status
// @route   PUT /api/sales/:id/status
// @access  Private/Admin
exports.updateSaleStatus = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      sale.status = req.body.status || sale.status;
      const updatedSale = await sale.save();
      res.json(updatedSale);
    } else {
      res.status(404).json({ message: 'Venda não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar status da venda', error: error.message });
  }
};

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
// @access  Private/Admin
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      await sale.remove(); // ou usar soft delete se preferir
      res.json({ message: 'Venda removida com sucesso' });
    } else {
      res.status(404).json({ message: 'Venda não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover venda', error: error.message });
  }
};
