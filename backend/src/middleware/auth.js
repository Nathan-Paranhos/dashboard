const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Assumes payload is { user: { id, role, ... } }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token não é válido' });
  }
}

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: 'Acesso negado. Permissão insuficiente.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Acesso negado. Permissão insuficiente.' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
