const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'A quantidade deve ser pelo menos 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'O preço unitário não pode ser negativo']
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'O nome do cliente é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'O valor total não pode ser negativo']
  },
  status: {
    type: String,
    enum: ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  paymentMethod: {
    type: String,
    enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'boleto'],
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'As observações devem ter no máximo 500 caracteres']
  }
}, {
  timestamps: true
});

// Middleware para calcular o preço total dos itens
saleItemSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

// Middleware para calcular o valor total da venda
saleSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
  next();
});

// Índices para relatórios
saleSchema.index({ createdAt: -1 });
saleSchema.index({ seller: 1, createdAt: -1 });
saleSchema.index({ status: 1 });

module.exports = mongoose.model('Sale', saleSchema);
