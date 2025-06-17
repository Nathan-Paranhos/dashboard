const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true,
    maxlength: [100, 'O nome deve ter no máximo 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'A categoria é obrigatória'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'O preço é obrigatório'],
    min: [0, 'O preço não pode ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'O estoque é obrigatório'],
    min: [0, 'O estoque não pode ser negativo'],
    default: 0
  },
  description: {
    type: String,
    maxlength: [500, 'A descrição deve ter no máximo 500 caracteres']
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para melhor performance
productSchema.index({ name: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
