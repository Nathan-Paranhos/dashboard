const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const Token = require('../models/Token'); // Modelo para a blacklist de tokens
const { registerSchema, loginSchema } = require('../validators/authValidators');

// Função auxiliar para gerar tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Token de acesso de curta duração
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // Refresh token de longa duração
  );

  return { accessToken, refreshToken };
};

// Registrar usuário
exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Já existe um usuário com este email.' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso.' });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    // Armazenar refresh token no cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Em produção, usar https
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Login realizado com sucesso.',
      accessToken,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Logout de usuário
exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    // Adicionar o token à blacklist para invalidá-lo
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const token = new Token({ token: refreshToken, expireAt: new Date(decoded.exp * 1000) });
      await token.save();
    } catch (error) {
      // Ignorar erros de token inválido ou expirado
    }
  }

  res.clearCookie('refreshToken');
  res.json({ message: 'Logout realizado com sucesso.' });
};

// Renovar o access token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token não encontrado.' });
  }

  // Verificar se o token está na blacklist
  const isBlacklisted = await Token.findOne({ token: refreshToken });
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const { accessToken } = await generateTokens(user);

    res.json({ accessToken });

  } catch (error) {
    return res.status(403).json({ message: 'Refresh token inválido ou expirado.' });
  }
};

// Verificar token
exports.verifyToken = (req, res) => {
  res.json({ message: 'Token válido', user: req.user });
};
