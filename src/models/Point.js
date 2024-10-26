const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thirdPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'ThirdParty' },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  // ... otros campos del punto
});

const Point = mongoose.model('Point', pointSchema);

module.exports = Point;
