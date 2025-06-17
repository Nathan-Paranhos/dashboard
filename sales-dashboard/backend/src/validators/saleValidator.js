const Joi = require('joi');

// Validador para os itens da venda
const saleItemSchema = Joi.object({
    product: Joi.string().hex().length(24).required().messages({
        'string.hex': 'O ID do produto deve ser um ObjectId hexadecimal válido.',
        'string.length': 'O ID do produto deve ter exatamente 24 caracteres.',
        'any.required': 'O ID do produto é obrigatório.'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'number.min': 'A quantidade deve ser de no mínimo 1.',
        'any.required': 'A quantidade é obrigatória.'
    })
});

// Validador para a venda principal
const saleSchema = Joi.object({
    customer: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'O nome do cliente é obrigatório.'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'O email do cliente é inválido.',
            'any.required': 'O email do cliente é obrigatório.'
        })
    }).required(),
    items: Joi.array().items(saleItemSchema).min(1).required().messages({
        'array.min': 'A venda deve conter pelo menos 1 item.',
        'any.required': 'Os itens da venda são obrigatórios.'
    }),
    paymentMethod: Joi.string().valid('credit_card', 'boleto', 'pix', 'cash').required().messages({
        'any.only': 'O método de pagamento é inválido.',
        'any.required': 'O método de pagamento é obrigatório.'
    }),
    status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'canceled').optional()
});

const validateSale = (req, res, next) => {
    const { error } = saleSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: `Erro de validação: ${errorMessages}` });
    }

    next();
};

module.exports = { validateSale };
