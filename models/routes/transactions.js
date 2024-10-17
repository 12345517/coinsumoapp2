const express = require('express');
const router = express.Router();
const Transaction = require('../../models/Transaction');
const authMiddleware = require('../../middleware/authMiddleware');

//Obtener todas las transacciones
router.get('/', authMiddleware.authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('userId').populate('walletId');
        res.json(transactions);
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
    }
});

// Crear una nueva transacción
router.post('/', authMiddleware.authMiddleware, async (req, res) => {
    const { amount, type, walletId, userId } = req.body;
    const newTransaction = new Transaction({ amount, type, walletId, userId });

    // Validaciones
    if (!amount || !type || !walletId || !userId) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'El monto debe ser positivo' });
    }

    try {
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({ message: 'Error al crear transacción', error: error.message });
    }
});


//Obtener transacción por ID
router.get('/:id', authMiddleware.authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('userId').populate('walletId');
        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json(transaction);
    } catch (error) {
        console.error('Error al obtener transacción:', error);
        res.status(500).json({ message: 'Error al obtener transacción', error: error.message });
    }
});

//Actualizar transacción por ID
router.patch('/:id', authMiddleware.authMiddleware, async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json(updatedTransaction);
    } catch (error) {
        console.error('Error al actualizar transacción:', error);
        res.status(500).json({ message: 'Error al actualizar transacción', error: error.message });
    }
});

//Eliminar transacción por ID
router.delete('/:id', authMiddleware.authMiddleware, async (req, res) => {
    try {
        const result = await Transaction.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        res.json({ message: 'Transacción eliminada' });
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        res.status(500).json({ message: 'Error al eliminar transacción', error: error.message });
    }
});

module.exports = router;
 