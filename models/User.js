const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    idNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whatsapp: { type: String },
    pais: { type: String, required: true },
    departamento: { type: String, required: true },
    ciudad: { type: String, required: true },
    direccion: { type: String, required: true },
    role: { type: String, enum: ['cliente', 'empresario', 'mayorista', 'colaborador'], required: true },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commissions: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number, default: 0 },
        description: { type: String }
    }],
    //Otros campos...
});

const User = mongoose.model('User', userSchema);
module.exports = User;
 