const mongoose = require('mongoose')

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: true
  }
})

const saleSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
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
    min: [0, 'Total amount cannot be negative']
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
    maxlength: [500, 'Notes must be at most 500 characters']
  }
}, {
  timestamps: true
})

// Middleware to calculate total price of items
saleItemSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice
  next()
})

// Middleware to calculate total amount of the sale
saleSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0)
  next()
})

// Indexes for reports
saleSchema.index({ createdAt: -1 })
saleSchema.index({ seller: 1, createdAt: -1 })
saleSchema.index({ status: 1 })

module.exports = mongoose.model('Sale', saleSchema)
