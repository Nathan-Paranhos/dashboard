const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'O nome do produto deve ser um texto.',
        'string.min': 'O nome do produto deve ter no mínimo {#limit} caracteres.',
        'string.max': 'O nome do produto deve ter no máximo {#limit} caracteres.',
        'any.required': 'O nome do produto é obrigatório.'
    }),
    description: Joi.string().max(500).optional().allow('').messages({
        'string.base': 'A descrição deve ser um texto.',
        'string.max': 'A descrição não pode exceder {#limit} caracteres.'
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'O preço deve ser um número.',
        'number.positive': 'O preço deve ser um valor positivo.',
        'any.required': 'O preço é obrigatório.'
    }),
    category: Joi.string().min(2).max(50).required().messages({
        'string.base': 'A categoria deve ser um texto.',
        'string.min': 'A categoria deve ter no mínimo {#limit} caracteres.',
        'string.max': 'A categoria deve ter no máximo {#limit} caracteres.',
        'any.required': 'A categoria é obrigatória.'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'O estoque deve ser um número.',
        'number.integer': 'O estoque deve ser um número inteiro.',
        'number.min': 'O estoque não pode ser negativo.',
        'any.required': 'A quantidade em estoque é obrigatória.'
    }),
    sku: Joi.string().max(50).optional().allow('').messages({
        'string.base': 'O SKU deve ser um texto.',
        'string.max': 'O SKU não pode exceder {#limit} caracteres.'
    })
});

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: `Erro de validação: ${errorMessages}` });
    }

    next();
};

module.exports = { validateProduct };
