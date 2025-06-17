const Product = require('../models/Product');

// @desc    Criar um novo produto
// @route   POST /api/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  const { name, category, price, stock, description, image } = req.body;

  try {
    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      description,
      image,
      createdBy: req.user.id // Adiciona o ID do usuário que criou o produto
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Obter um produto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  const { name, category, price, stock, description, image } = req.body;

  // Build product object
  const productFields = {};
  if (name) productFields.name = name;
  if (category) productFields.category = category;
  if (price) productFields.price = price;
  if (stock) productFields.stock = stock;
  if (description) productFields.description = description;
  if (image) productFields.image = image;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Deletar um produto
// @route   DELETE /api/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    await product.deleteOne(); // Use deleteOne() for Mongoose v6+

    res.json({ msg: 'Produto removido' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

