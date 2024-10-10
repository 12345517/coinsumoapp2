const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thirdPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ThirdParty', required: true },
  purchaseValue: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  // ... otros campos de la compra
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
