const mongoose = require('mongoose');

const entrepreneurSchema = new mongoose.Schema({
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

const Entrepreneur = mongoose.model('Entrepreneur', entrepreneurSchema);

module.exports = mongoose.model('Entrepreneur', entrepreneurSchema);