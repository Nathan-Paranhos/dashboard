const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Todas as rotas abaixo são protegidas e acessíveis apenas por administradores
router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
