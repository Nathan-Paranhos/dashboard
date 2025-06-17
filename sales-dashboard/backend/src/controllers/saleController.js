const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Criar uma nova venda
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
    const { customer, items, paymentMethod } = req.body;

    try {
        // 1. Verificar se os produtos existem e se há estoque suficiente
        const productIds = items.map(item => item.product);
        const productsInDb = await Product.find({ '_id': { $in: productIds } });

        if (productsInDb.length !== productIds.length) {
            return res.status(404).json({ message: 'Um ou mais produtos não foram encontrados.' });
        }

        for (const item of items) {
            const product = productsInDb.find(p => p._id.toString() === item.product);
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Estoque insuficiente para o produto: ${product.name}` });
            }
        }

        // 2. Criar a nova venda (o Mongoose irá calcular os totais)
        const sale = new Sale({
            seller: req.user._id, // ID do vendedor logado
            customer,
            items,
            paymentMethod,
            status: 'paid' // ou 'pending' dependendo da regra de negócio
        });

        const createdSale = await sale.save();

        // 3. Atualizar o estoque dos produtos
        for (const item of createdSale.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json(createdSale);

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao criar a venda.', error: error.message });
    }
};

// @desc    Obter todas as vendas (com filtros)
// @route   GET /api/sales
// @access  Private (Admin pode ver todas, Vendedor só as suas)
const getSales = async (req, res) => {
    try {
        const query = {};
        if (req.user.role !== 'admin') {
            query.seller = req.user._id;
        }

        const sales = await Sale.find(query)
            .populate('seller', 'name email')
            .populate('items.product', 'name price');

        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar as vendas.', error: error.message });
    }
};

// @desc    Obter uma venda por ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('seller', 'name email')
            .populate('items.product', 'name price category');

        if (!sale) {
            return res.status(404).json({ message: 'Venda não encontrada.' });
        }

        // Garantir que o vendedor só possa ver suas próprias vendas
        if (req.user.role !== 'admin' && sale.seller._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Acesso não autorizado a esta venda.' });
        }

        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar a venda.', error: error.message });
    }
};

// @desc    Atualizar o status de uma venda
// @route   PATCH /api/sales/:id/status
// @access  Private (Admin)
const updateSaleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'paid', 'shipped', 'delivered', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Status inválido.' });
        }

        const sale = await Sale.findById(req.params.id);

        if (sale) {
            // Lógica para retornar estoque se a venda for cancelada
            if (status === 'canceled' && sale.status !== 'canceled') {
                for (const item of sale.items) {
                    await Product.findByIdAndUpdate(item.product, { 
                        $inc: { stock: item.quantity } 
                    });
                }
            }

            sale.status = status;
            const updatedSale = await sale.save();
            res.json(updatedSale);
        } else {
            res.status(404).json({ message: 'Venda não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao atualizar o status da venda.', error: error.message });
    }
};

module.exports = {
    createSale,
    getSales,
    getSaleById,
    updateSaleStatus
};
