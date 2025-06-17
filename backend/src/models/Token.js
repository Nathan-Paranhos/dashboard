const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // O MongoDB automaticamente deletará o documento quando a data de expiração for atingida.
  expireAt: {
    type: Date,
    required: true,
    index: { expires: '1s' }, // TTL index para expirar o token
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
