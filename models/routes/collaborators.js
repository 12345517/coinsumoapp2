const express = require('express');
const router = express.Router();
const User = require('../models/User');

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
        console.error('Error al registrar afiliado:', error);
        res.status(500).json({ message: 'Error al registrar afiliado', details: error.message });
    }
});

// Función para asignar niveles y comisiones
async function assignLevelsAndCommissions(user) {
    let currentUser = user;
    for (let level = 1; level <= 10; level++) {
        if (!currentUser.sponsorId) break;
        const sponsor = await User.findById(currentUser.sponsorId);
        if (!sponsor) break;

        // Asignar comisión al sponsor
        const commissionAmount = calculateCommission(level);
        sponsor.commissions.push({
            amount: commissionAmount,
            description: `Comisión de nivel ${level} por registro de ${user.name}`
        });
        await sponsor.save();

        currentUser = sponsor;
    }
}

// Función para calcular la comisión basada en el nivel
function calculateCommission(level) {
    const commissionRates = [10, 5, 3, 2, 1, 1, 1, 1, 1, 1]; // Ejemplo de tasas de comisión por nivel
    return commissionRates[level - 1];
}

module.exports = router;