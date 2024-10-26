const mongoose = require('mongoose');

const wholesaleSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  contact: { type: String }, // Puedes eliminar este campo si no quieres que los mayoristas pongan su número de contacto
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // ... Otros campos que necesites para el mayorista
  // (por ejemplo,  membershipStatus, membershipExpiryDate)
  membershipStatus: { type: String, default: 'inactive' }, // Estado de membresía (active, inactive, suspended)
  membershipExpiryDate: { type: Date } // Fecha de expiración de membresía
});

const Wholesale = mongoose.model('Wholesale', wholesaleSchema);

module.exports = Wholesale;