const express = require('express');
const router = express.Router();
const Wallet = require('../Wallet');
const Transaction = require('../Transaction');
const authMiddleware = require('../../middleware/authMiddleware');  //Aseg

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

// Recargar la billetera de un usuario
router.post('/recargar/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'El monto de la recarga debe ser positivo' });
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }

    wallet.balance += amount;
    await wallet.save();

    const newTransaction = new Transaction({
      userId,
      type: 'recarga',
      amount,
      description: 'Recarga de billetera'
    });
    await newTransaction.save();

    res.json({ message: 'Billetera recargada correctamente', newBalance: wallet.balance });
  } catch (error) {
    console.error('Error al recargar la billetera:', error);
    res.status(500).json({ message: 'Error al recargar la billetera' });
  }
});

// Transferir dinero a otro usuario
router.post('/transferir/:senderId/:receiverId', authMiddleware, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'El monto de la transferencia debe ser positivo' });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ message: 'No puedes transferir dinero a ti mismo' });
    }

    const senderWallet = await Wallet.findOne({ userId: senderId });
    const receiverWallet = await Wallet.findOne({ userId: receiverId });
    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: 'Una o ambas billeteras no se encontraron' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    await senderWallet.save();
    await receiverWallet.save();

    const senderTransaction = new Transaction({
      userId: senderId,
      type: 'transferencia',
      amount: -amount,
      description: 'Transferencia a usuario ' + receiverId
    });

    const receiverTransaction = new Transaction({
      userId: receiverId,
      type: 'transferencia',
      amount,
      description: 'Transferencia recibida de usuario ' + senderId
    });

    await senderTransaction.save();
    await receiverTransaction.save();

    res.json({ message: 'Transferencia realizada con éxito' });
  } catch (error) {
    console.error('Error al transferir dinero:', error);
    res.status(500).json({ message: 'Error al transferir dinero' });
  }
});

// Obtener historial de transacciones de un usuario
router.get('/historial/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: 'No se encontraron transacciones' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error al obtener el historial de transacciones:', error);
    res.status(500).json({ message: 'Error al obtener el historial de transacciones' });
  }
});

module.exports = router;