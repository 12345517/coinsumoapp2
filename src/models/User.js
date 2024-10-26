const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
  affiliates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  whatsapp: { type: String },
  pais: { type: String, required: true },
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  direccion: { type: String, required: true },
  role: { type: String, enum: ['cliente', 'empresario', 'mayorista', 'colaborador', 'admin'], required: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commissions: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number, default: 0 },
    description: { type: String }
  }],
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

userSchema.methods.generateEmailVerificationToken = function() {
  this.emailVerificationToken = crypto.randomBytes(20).toString('hex');
};

const User = mongoose.model('User', userSchema);

module.exports = User;