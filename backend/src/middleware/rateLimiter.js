const rateLimit = require('express-rate-limit');

// Limita as tentativas de login e registro para prevenir ataques de força bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita cada IP a 10 requisições por janela
  message: 'Muitas tentativas de autenticação a partir deste IP, por favor, tente novamente após 15 minutos.',
  standardHeaders: true, // Retorna informações do limite nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
});

module.exports = { authLimiter };
