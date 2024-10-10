const express = require('express');
const router = express.Router();
const User = require('../User');
const authMiddleware = require('../../middleware/authMiddleware');

// Ruta para obtener la información de un empresario
router.get('/:entrepreneurId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un empresario
    if (!user.entrepreneur) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Buscar el empresario
    const entrepreneur = await User.findById(req.params.entrepreneurId);
    if (!entrepreneur) {
      return res.status(404).json({ message: 'Empresario no encontrado' });
    }

    // Verificar si el usuario actual es el mismo empresario
    if (entrepreneur._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este empresario' });
    }

    // Obtener el saldo del empresario
    const balance = await Wallet.findOne({ userId: entrepreneur._id }).balance;

    // Verificar si el empresario está al día con su membresía
    const membershipStatus = await verifyMembershipStatus(entrepreneur._id); 
    if (!membershipStatus) {
      return res.status(403).json({ message: 'La membresía del empresario no está al día' });
    }

    // Responder con la información del empresario
    res.json({
      id: entrepreneur._id,
      idNumber: entrepreneur.idNumber,
      name: entrepreneur.name,
      email: entrepreneur.email,
      balance, // Saldo de la billetera
      // ... otros campos del empresario
    });
  } catch (error) {
    console.error('Error al obtener la información del empresario:', error);
    res.status(500).json({ message: 'Error al obtener la información del empresario' });
  }
});

// Ruta para crear un nuevo empresario
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un mayorista
    if (!user.wholesale) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Crear un nuevo empresario
    const newEntrepreneur = new User({
      ...req.body, // Datos del nuevo empresario
      entrepreneur: true
    });
    await newEntrepreneur.save();

    // ... (Lógica para asignar la billetera al empresario)

    res.status(201).json({ message: 'Empresario creado' });
  } catch (error) {
    console.error('Error al crear el empresario:', error);
    res.status(500).json({ message: 'Error al crear el empresario' });
  }
});

// Ruta para actualizar la información de un empresario
router.patch('/:entrepreneurId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el empresario
    const entrepreneur = await User.findById(req.params.entrepreneurId);
    if (!entrepreneur) {
      return res.status(404).json({ message: 'Empresario no encontrado' });
    }

    // Verificar si el usuario actual es el mismo empresario
    if (entrepreneur._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este empresario' });
    }

    // Actualizar la información del empresario
    await User.updateOne(
      { _id: entrepreneur._id },
      { $set: req.body },
    );

    res.json({ message: 'Empresario actualizado' });
  } catch (error) {
    console.error('Error al actualizar la información del empresario:', error);
    res.status(500).json({ message: 'Error al actualizar la información del empresario' });
  }
});

// Ruta para eliminar un empresario
router.delete('/:entrepreneurId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el empresario
    const entrepreneur = await User.findById(req.params.entrepreneurId);
    if (!entrepreneur) {
      return res.status(404).json({ message: 'Empresario no encontrado' });
    }

    // Verificar si el usuario actual es el mismo empresario
    if (entrepreneur._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este empresario' });
    }

    // Eliminar el empresario
    await User.deleteOne({ _id: entrepreneur._id });

    res.json({ message: 'Empresario eliminado' });
  } catch (error) {
    console.error('Error al eliminar el empresario:', error);
    res.status(500).json({ message: 'Error al eliminar el empresario' });
  }
});

module.exports = router;
 