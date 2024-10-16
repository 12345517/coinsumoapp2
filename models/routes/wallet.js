const express = require('express');
const router = express.Router();
const Wallet = require('../Wallet'); // Asegúrate de que la ruta sea correcta
const User = require('../User'); // Asegúrate de que la ruta sea correcta
const Transaction = require('../Transaction'); // Asegúrate de que la ruta sea correcta
const { authMiddleware } = require('../../middleware/authMiddleware');
const validateUserId = require('../../middleware/validatorUserId');
const validateAmount = require('../../middleware/validators/validateAmount'); // Actualiza esta ruta

// Obtener el saldo de la billetera de un usuario
router.get('/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Billetera no encontrada' });
    }
    res.json({ balance: wallet.balance });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Recargar billetera
router.post('/recargar/:userId', authMiddleware, validateUserId, validateAmount, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { amount } = req.body;
        const wallet = await Wallet.findOne({ userId: req.params.userId });

        const newTransaction = new Transaction({
            userId: req.params.userId,
            type: 'recarga',
            amount,
            description: 'Recarga de billetera',
        });

        await newTransaction.save();
        wallet.balance += amount;
        await wallet.save();

        res.json(wallet);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

module.exports = router;