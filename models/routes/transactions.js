const express = require('express');
const router = express.Router();
const Transaction = require('../../models/Transaction'); // Importa el modelo de transacción
const authMiddleware = require('../../middleware/authMiddleware'); // Importa el middleware de autenticación

// Ruta para obtener todas las transacciones (solo para usuarios autenticados)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId').populate('walletId');
    res.json(transactions);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
});

// Ruta para crear una nueva transacción
router.post('/', authMiddleware, async (req, res) => {
  const { amount, type, walletId, userId } = req.body;

  // Validaciones
  if (!amount || !type || !walletId || !userId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Crear la nueva transacción
    const newTransaction = new Transaction({
      amount,
      type,
      walletId,
      userId
    });
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ message: 'Error al crear transacción' });
  }
});

// Ruta para obtener una transacción por ID (solo para usuarios autenticados)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('userId').populate('walletId');
    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    res.status(500).json({ message: 'Error al obtener transacción' });
  }
});

// Ruta para actualizar una transacción por ID (solo para usuarios autenticados)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.updateOne(
      { _id: req.params.id },
      { $set: req.body },
    );
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    res.status(500).json({ message: 'Error al actualizar transacción' });
  }
});

// Ruta para eliminar una transacción por ID (solo para usuarios autenticados)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id });
    res.json({ message: 'Transacción eliminada' });
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({ message: 'Error al eliminar transacción' });
  }
});

module.exports = router;
  