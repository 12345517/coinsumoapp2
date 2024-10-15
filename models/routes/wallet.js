const express = require('express');
const router = express.Router();
const Wallet = require('../Wallet'); // Asegúrate de que la ruta sea correcta
const User = require('../User'); // Asegúrate de que la ruta sea correcta
const Transaction = require('../Transaction'); // Asegúrate de que la ruta sea correcta
const { authMiddleware } = require('../../middleware/authMiddleware');
const validateUserId = require('../../middleware/validatorUserId');
const validateAmount = require('../../middleware/validators/validateAmount');
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
            walletId: wallet._id
        });
        await newTransaction.save();
        wallet.balance += amount;
        await wallet.save();
        res.json({ message: 'Recarga exitosa', newBalance: wallet.balance });
    } catch (error) {
        console.error('Error al recargar:', error);
        next(error); // Pass the error to the error handling middleware
    }
});

// Transferir dinero
router.post('/transferir/:senderId/:receiverId', authMiddleware, [
    param('senderId').custom(async (value) => {
        const sender = await User.findById(value);
        if (!sender) {
            throw Error('Remitente no encontrado');
        }
        return true;
    }),
    param('receiverId').custom(async (value) => {
        const receiver = await User.findById(value);
        if (!receiver) {
            throw new Error('Destinatario no encontrado');
        }
        return true;
    }),
    body('amount').isFloat({ gt: 0 }).withMessage('Monto debe ser positivo')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { senderId, receiverId } = req.params;
        const { amount } = req.body;

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'No puedes transferir a ti mismo' });
        }

        const senderWallet = await Wallet.findOne({ userId: senderId });
        const receiverWallet = await Wallet.findOne({ userId: receiverId });

        if (!senderWallet || !receiverWallet) {
            return res.status(404).json({ message: 'Billetera(s) no encontrada(s)' });
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const senderTransaction = new Transaction({
                userId: senderId,
                type: 'transferencia',
                amount: -amount,
                description: `Transferencia a ${receiverId}`,
                walletId: senderWallet._id
            });

            const receiverTransaction = new Transaction({
                userId: receiverId,
                type: 'transferencia',
                amount,
                description: `Transferencia de ${senderId}`,
                walletId: receiverWallet._id
            });

            await senderTransaction.save({ session });
            await receiverTransaction.save({ session });
            senderWallet.balance -= amount;
            await senderWallet.save({ session });
            receiverWallet.balance += amount;
            await receiverWallet.save({ session });
            await session.commitTransaction();
            res.json({ message: 'Transferencia exitosa' });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Error al transferir:', error);
        next(error); // Pass the error to the error handling middleware
    }
});

// Obtener historial de transacciones
router.get('/historial/:userId', authMiddleware, validateUserId, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 }).populate('walletId');
        res.json(transactions);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        next(error); // Pass the error to the error handling middleware
    }
});

module.exports = router;