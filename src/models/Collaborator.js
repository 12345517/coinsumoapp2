const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    commission: {
        type: Number,
        default: 0
    },
    entrepreneurs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entrepreneur'
    }],
    wholesalers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wholesaler'
    }]
});

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

module.exports = Collaborator;