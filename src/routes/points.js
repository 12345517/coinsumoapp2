const express = require('express');
const router = express.Router();
const Point = require('../models/Point');
const User = require('../models/User');
const { distributePoints } = require('./utils/matrix');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener el saldo de puntos de un usuario
router.get('/:userId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ points: user.totalPoints });
  } catch (error) {
    console.error('Error al obtener el saldo de puntos:', error);
    res.status(500).json({ message: 'Error al obtener el saldo de puntos' });
  }
});

// Canjear puntos por productos o servicios
router.post('/canjear/:userId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    // Validaciones
    if (amount <= 0) {
      return res.status(400).json({ message: 'El monto de puntos a canjear debe ser positivo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.totalPoints < amount) {
      return res.status(400).json({ message: 'Puntos insuficientes' });
    }

    // Actualizar el saldo de puntos del usuario
    user.totalPoints -= amount;
    await user.save();

    // Registrar la transacción de puntos
    const newPointTransaction = new Point({
      userId,
      amount: -amount // Registrar como una reducción de puntos
    });
    await newPointTransaction.save();

    res.json({ message: 'Puntos canjeados correctamente', newPointsBalance: user.totalPoints });
  } catch (error) {
    console.error('Error al canjear puntos:', error);
    res.status(500).json({ message: 'Error al canjear puntos' });
  }
});

// Ruta para registrar puntos ganados por un usuario (se llama desde otro lugar, como una compra)
router.post('/registrar/:userId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, purchaseAmount } = req.body; // purchaseAmount es el monto de la compra

    if (amount <= 0) {
      return res.status(400).json({ message: 'El monto de puntos a registrar debe ser positivo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los puntos del usuario
    user.totalPoints += amount;
    user.pointsEarned += amount;
    await user.save();

    // Distribuir los puntos en la red de afiliados
    await distributePoints(user, purchaseAmount); // Implementa la lógica de distribución de puntos

    // Registrar la transacción de puntos
    const newPointTransaction = new Point({
      userId,
      amount
    });
    await newPointTransaction.save();

    res.json({ message: 'Puntos registrados correctamente', newPointsBalance: user.totalPoints });
  } catch (error) {
    console.error('Error al registrar puntos:', error);
    res.status(500).json({ message: 'Error al registrar puntos' });
  }
});

module.exports = router;
