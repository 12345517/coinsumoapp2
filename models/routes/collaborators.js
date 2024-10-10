const express = require('express');
const router = express.Router();
const User = require('../User');
const authMiddleware = require('../../middleware/authMiddleware');

// Ruta para obtener la información de un colaborador
router.get('/:collaboratorId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el colaborador
    const collaborator = await User.findById(req.params.collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    // Verificar si el usuario actual es el mismo colaborador
    if (collaborator._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este colaborador' });
    }

    // Verificar si el colaborador está asociado a un empresario
    if (!collaborator.entrepreneurId) {
      return res.status(400).json({ message: 'Colaborador no asociado a un empresario' });
    }

    // Obtener el empresario asociado
    const entrepreneur = await User.findById(collaborator.entrepreneurId);

    // Obtener el saldo del colaborador
    const balance = await Wallet.findOne({ userId: collaborator._id }).balance;

    // Responder con la información del colaborador
    res.json({
      id: collaborator._id,
      idNumber: collaborator.idNumber,
      name: collaborator.name,
      email: collaborator.email,
      balance, // Saldo de la billetera
      entrepreneur: {
        id: entrepreneur._id,
        name: entrepreneur.name,
        email: entrepreneur.email
        // ... otros campos del empresario
      },
      // ... otros campos del colaborador
    });
  } catch (error) {
    console.error('Error al obtener la información del colaborador:', error);
    res.status(500).json({ message: 'Error al obtener la información del colaborador' });
  }
});

// Ruta para crear un nuevo colaborador
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Verificar si el usuario es un empresario
    if (!user.entrepreneur) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    // Crear un nuevo colaborador
    const newCollaborator = new User({
      ...req.body, // Datos del nuevo colaborador
      collaborator: true,
      entrepreneurId: user._id // Asignar el empresario al colaborador
    });
    await newCollaborator.save();

    // ... (Lógica para asignar la billetera al colaborador)

    res.status(201).json({ message: 'Colaborador creado' });
  } catch (error) {
    console.error('Error al crear el colaborador:', error);
    res.status(500).json({ message: 'Error al crear el colaborador' });
  }
});

// Ruta para actualizar la información de un colaborador
router.patch('/:collaboratorId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el colaborador
    const collaborator = await User.findById(req.params.collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    // Verificar si el usuario actual es el mismo colaborador
    if (collaborator._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este colaborador' });
    }

    // Verificar si el colaborador está asociado a un empresario
    if (!collaborator.entrepreneurId) {
      return res.status(400).json({ message: 'Colaborador no asociado a un empresario' });
    }

    // Obtener el empresario asociado
    const entrepreneur = await User.findById(collaborator.entrepreneurId);

    // Actualizar la información del colaborador
    await User.updateOne(
      { _id: collaborator._id },
      { $set: req.body },
    );

    res.json({ message: 'Colaborador actualizado' });
  } catch (error) {
    console.error('Error al actualizar la información del colaborador:', error);
    res.status(500).json({ message: 'Error al actualizar la información del colaborador' });
  }
});

// Ruta para eliminar un colaborador
router.delete('/:collaboratorId', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);

    // Buscar el colaborador
    const collaborator = await User.findById(req.params.collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' });
    }

    // Verificar si el usuario actual es el mismo colaborador
    if (collaborator._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este colaborador' });
    }

    // Eliminar el colaborador
    await User.deleteOne({ _id: collaborator._id });

    res.json({ message: 'Colaborador eliminado' });
  } catch (error) {
    console.error('Error al eliminar el colaborador:', error);
    res.status(500).json({ message: 'Error al eliminar el colaborador' });
  }
});

module.exports = router;
 