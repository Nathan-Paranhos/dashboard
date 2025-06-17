const Joi = require('joi');

// Esquema de validação para registro com política de senha forte
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  // Exige no mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
      'string.min': 'A senha deve ter no mínimo 8 caracteres.',
      'any.required': 'O campo senha é obrigatório.'
    }),
  role: Joi.string().valid('admin', 'vendedor').default('vendedor')
});

// Esquema de validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
