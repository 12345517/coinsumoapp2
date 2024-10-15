module.exports = function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acceso denegado. No eres administrador.' });
  }
  next();
};