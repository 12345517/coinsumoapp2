const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const Collaborator = require('../models/Collaborator'); // Asegúrate de que la ruta sea correcta

// Registrar nuevo afiliado
router.post('/register', async (req, res) => {
    try {
        const { idNumber, name, email, password, whatsapp, pais, departamento, ciudad, direccion, role, sponsorId } = req.body;
        const newUser = new User({ idNumber, name, email, password, whatsapp, pais, departamento, ciudad, direccion, role, sponsorId });
        await newUser.save();

        // Asignar niveles y comisiones
        await assignLevelsAndCommissions(newUser);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Elimina cualquier configuración de app.listen aquí

module.exports = router;