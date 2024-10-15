const mongoose = require('mongoose');

const wholesalerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    revenue: {
        type: Number,
        default: 0
    },
    collaborator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collaborator'
    }
});

const Wholesaler = mongoose.model('Wholesaler', wholesalerSchema);

module.exports = Wholesaler;