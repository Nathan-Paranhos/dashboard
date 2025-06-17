const Product = require('../models/Product');

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, sku } = req.body;

        const productExists = await Product.findOne({ sku });
        if (productExists && sku) {
            return res.status(400).json({ message: 'Um produto com este SKU já existe.' });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            sku
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao criar produto.', error: error.message });
    }
};

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar produtos.', error: error.message });
    }
};

// @desc    Obter um produto por ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar o produto.', error: error.message });
    }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, sku } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.sku = sku || product.sku;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao atualizar o produto.', error: error.message });
    }
};

// @desc    Deletar um produto
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // Usando deleteOne() a partir do Mongoose 5.5+
            res.json({ message: 'Produto removido com sucesso.' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao deletar o produto.', error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
