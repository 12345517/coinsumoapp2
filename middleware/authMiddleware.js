const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Acceso denegado' });
    next();
};

module.exports = { authMiddleware, adminMiddleware };
 
 