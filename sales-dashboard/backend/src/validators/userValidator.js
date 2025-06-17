const Joi = require('joi');

const userUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'O nome deve ser um texto.',
        'string.min': 'O nome deve ter no mínimo {#limit} caracteres.',
        'string.max': 'O nome deve ter no máximo {#limit} caracteres.'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'O formato do email é inválido.'
    }),
    role: Joi.string().valid('admin', 'vendedor').optional().messages({
        'any.only': 'O cargo deve ser \"admin\" ou \"vendedor\".'
    }),
    // Não permitir a atualização da senha por esta rota por segurança.
    // A alteração de senha deve ter um fluxo próprio.
    password: Joi.any().strip() 
});

const validateUserUpdate = (req, res, next) => {
    const { error } = userUpdateSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: `Erro de validação: ${errorMessages}` });
    }

    next();
};

module.exports = { validateUserUpdate };
