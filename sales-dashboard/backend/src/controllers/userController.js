const User = require('../models/User');

// @desc    Obter todos os usuários
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        // Omitir o usuário que está fazendo a requisição da lista, se desejado
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar usuários.', error: error.message });
    }
};

// @desc    Obter um usuário por ID
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao buscar o usuário.', error: error.message });
    }
};

// @desc    Atualizar um usuário
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            // Verificar se o email já está em uso por outro usuário
            if (req.body.email) {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ message: 'Este email já está em uso.' });
                }
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao atualizar o usuário.', error: error.message });
    }
};

// @desc    Deletar um usuário
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Adicionar lógica para não permitir que um admin se auto-delete
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'Você não pode deletar a si mesmo.' });
            }
            
            await user.deleteOne();
            res.json({ message: 'Usuário removido com sucesso.' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao deletar o usuário.', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
