const express = require('express');
const router = express.Router();
const Wallet = require('./Wallet');
const User = require('./User');
const Transaction = require('./Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener el saldo de la billetera de un usuario
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Billetera no encontrada' });
    }
    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error al obtener el saldo de la billetera:', error);
    res.status(500).json({ message: 'Error al obtener el saldo de la billetera' });
  }
});
 