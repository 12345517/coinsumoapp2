// models/routes/afiliados.js
const express = require('express');
const router = express.Router();
const User = require('../User'); // Ruta al modelo de usuario

// Endpoint para obtener afiliados por ID de usuario
router.get('/afiliados', async (req, res) => {
    const userId = req.query.userId; // Obtener el ID desde la query
    try {
        const afiliados = await User.find({ sponsorId: userId }); // Filtra los afiliados
        res.json({ afiliados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener afiliados' });
    }
});

module.exports = router;