// C:\Users\USUARIO\coinsumo\middleware\validateAmount.js
module.exports = function validateAmount(req, res, next) {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }
    next();
};