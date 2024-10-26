const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wholesale = require('../models/Wholesale'); 
const authMiddleware = require('../middleware/authMiddleware');
const verifyMembershipStatus = require('./utils/membership').verifyMembershipStatus;

// Ruta para obtener la información de un mayorista
router.get('/:wholesaleId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un mayorista
    if (!user.wholesale) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Buscar el mayorista
    const wholesale = await Wholesale.findById(req.params.wholesaleId);
    if (!wholesale) {
      return res.status(404).json({ message: 'Mayorista no encontrado' });
    }

    // Verificar si el mayorista está al día con su membresía
    const membershipStatus = await verifyMembershipStatus(wholesale._id); 
    if (!membershipStatus) {
      return res.status(403).json({ message: 'La membresía del mayorista no está al día' });
    }

    // Responder con la información del mayorista
    res.json({
      id: wholesale._id,
      name: wholesale.name,
      email: wholesale.email,
      contact: wholesale.contact, // Si se permite mostrar el contacto
      // ... otros campos del mayorista
    });
  } catch (error) {
    console.error('Error al obtener la información del mayorista:', error);
    res.status(500).json({ message: 'Error al obtener la información del mayorista' });
  }
});

// Ruta para crear un nuevo mayorista
router.post('/', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un mayorista
    if (!user.wholesale) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Crear un nuevo mayorista
    const newWholesale = new Wholesale({
      ...req.body, // Datos del nuevo mayorista
      // ... (Campos adicionales, como la membresía)
    });
    await newWholesale.save();

    res.status(201).json({ message: 'Mayorista creado' });
  } catch (error) {
    console.error('Error al crear el mayorista:', error);
    res.status(500).json({ message: 'Error al crear el mayorista' });
  }
});

// Ruta para actualizar la información de un mayorista
router.patch('/:wholesaleId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un mayorista
    if (!user.wholesale) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Buscar el mayorista
    const wholesale = await Wholesale.findById(req.params.wholesaleId);
    if (!wholesale) {
      return res.status(404).json({ message: 'Mayorista no encontrado' });
    }

    // Actualizar la información del mayorista
    await Wholesale.updateOne(
      { _id: wholesale._id },
      { $set: req.body },
    );

    res.json({ message: 'Mayorista actualizado' });
  } catch (error) {
    console.error('Error al actualizar la información del mayorista:', error);
    res.status(500).json({ message: 'Error al actualizar la información del mayorista' });
  }
});

// Ruta para eliminar un mayorista
router.delete('/:wholesaleId', authMiddleware.authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un mayorista
    if (!user.wholesale) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Buscar el mayorista
    const wholesale = await Wholesale.findById(req.params.wholesaleId);
    if (!wholesale) {
      return res.status(404).json({ message: 'Mayorista no encontrado' });
    }

    // Eliminar el mayorista
    await Wholesale.deleteOne({ _id: wholesale._id });

    res.json({ message: 'Mayorista eliminado' });
  } catch (error) {
    console.error('Error al eliminar el mayorista:', error);
    res.status(500).json({ message: 'Error al eliminar el mayorista' });
  }
});

module.exports = router;
 