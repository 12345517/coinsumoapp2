const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet'); // Asegúrate de que Wallet esté importado correctamente
const authMiddleware = require('../middleware/authMiddleware');
// Ruta para obtener la información de un domiciliario
router.get('/:domiciliarioId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el domiciliario
    const domiciliario = await User.findById(req.params.domiciliarioId);
    if (!domiciliario) {
      return res.status(404).json({ message: 'Domiliario no encontrado' });
    }

    // Verificar si el usuario actual es el mismo domiciliario
    if (domiciliario._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este domiciliario' });
    }

    // Obtener el saldo del domiciliario
    const balance = await Wallet.findOne({ userId: domiciliario._id }).balance;

    // Obtener la información del domiciliario
    res.json({
      id: domiciliario._id,
      idNumber: domiciliario.idNumber,
      name: domiciliario.name,
      email: domiciliario.email,
      balance, // Saldo de la billetera
      // ... otros campos del domiciliario
    });
  } catch (error) {
    console.error('Error al obtener la información del domiciliario:', error);
    res.status(500).json({ message: 'Error al obtener la información del domiciliario' });
  }
});

// Ruta para registrar una compra realizada por un domiciliario
router.post('/:domiciliarioId/compras', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el domiciliario
    const domiciliario = await User.findById(req.params.domiciliarioId);
    if (!domiciliario) {
      return res.status(404).json({ message: 'Domiliario no encontrado' });
    }

    // Verificar si el usuario actual es el mismo domiciliario
    if (domiciliario._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este domiciliario' });
    }

    // Obtener el monto de la compra
    const { amount, paymentMethod } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'El monto de la compra es obligatorio' });
    }

    // Validar el método de pago
    if (!domiciliario.paymentMethods[paymentMethod]) {
      return res.status(400).json({ message: 'Método de pago no válido' });
    }

    // Crear una nueva transacción
    const newTransaction = new Transaction({
      userId: domiciliario._id,
      amount: amount,
      paymentMethod: paymentMethod
    });
    await newTransaction.save();

    // Actualizar el saldo del domiciliario
    const wallet = await Wallet.findOne({ userId: domiciliario._id });
    wallet.balance += amount; // Se asume que el domiciliario recibe el monto de la compra
    await wallet.save();

    res.status(201).json({ message: 'Compra registrada' });
  } catch (error) {
    console.error('Error al registrar la compra:', error);
    res.status(500).json({ message: 'Error al registrar la compra' });
  }
});

module.exports = router;