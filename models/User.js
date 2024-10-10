const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true }, // Número de identificación
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Nuevo campo para admin
  whatsapp: { type: String },
  pais: { type: String, required: true }, // Nuevo campo para país
  departamento: { type: String, required: true }, // Nuevo campo para departamento
  ciudad: { type: String, required: true }, // Nuevo campo para ciudad
  direccion: { type: String, required: true }, // Nuevo campo para dirección
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  front: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  position: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  paymentMethods: {
    cash: { type: Boolean, default: true },
    qrCode: { type: Boolean, default: true }
  },
  membershipStatus: { type: String, default: 'inactive' },
  membershipExpiryDate: { type: Date },
  entrepreneur: { type: Boolean, default: false },
  wholesale: { type: Boolean, default: false },
  collaborator: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
 