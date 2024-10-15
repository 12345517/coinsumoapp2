// models/routes/afiliados.js
const express = require('express');
const router = express.Router();
const User = require('../User'); // Ruta al modelo de usuario

// Endpoint para obtener afiliados por ID de usuario
router.get('/afiliados', async (req, res) => {
    try {
        const userId = req.query.userId;
        // ... tu lógica para obtener afiliados ...
        res.json(afiliados); // Asegúrate de enviar una respuesta
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Error al obtener afiliados' });
    }
});

module.exports = router;