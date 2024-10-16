const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const Collaborator = require('../models/Collaborator'); // Asegúrate de que la ruta sea correcta

// Rutas y lógica para colaboradores

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};