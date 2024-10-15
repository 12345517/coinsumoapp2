const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware para actualizar la fecha de actualización
walletSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;