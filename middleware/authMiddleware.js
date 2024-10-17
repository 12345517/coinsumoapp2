const jwt = require('jsonwebtoken');

// Middleware para autenticar usuarios
function authMiddleware(req, res, next)  {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('AUtenticacion')
    return next();
  } catch (error) {
    return res.status(400).json({ message: 'Token no válido.' });
  }
};

// Middleware para autenticar administradores
const adminMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };