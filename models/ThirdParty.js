const mongoose = require('mongoose');

const thirdPartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  apiId: { type: String, required: true },
  apiUrl: { type: String, required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  // ... otros campos del tercero
});

const ThirdParty = mongoose.model('ThirdParty', thirdPartySchema);

module.exports = ThirdParty;
