const express = require('express');
const router = express.Router();
const Contact = require('../Contact');
const authMiddleware = require('../../middleware/authMiddleware'); // Tu middleware de autenticación

// Ruta para obtener todos los contactos
router.get('/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('Error al obtener los contactos:', error);
    res.status(500).json({ message: 'Error al obtener los contactos' });
  }
});

// Ruta para crear un nuevo contacto
router.post('/contacts', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;
    const newContact = new Contact({ name, email, phone, notes });
    await newContact.save();
    res.status(201).json({ message: 'Contacto creado correctamente', contact: newContact });
  } catch (error) {
    console.error('Error al crear el contacto:', error);
    res.status(500).json({ message: 'Error al crear el contacto' });
  }
});

// Ruta para actualizar un contacto
router.put('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone, notes }, { new: true });
    res.json({ message: 'Contacto actualizado correctamente', contact: updatedContact });
  } catch (error) {
    console.error('Error al actualizar el contacto:', error);
    res.status(500).json({ message: 'Error al actualizar el contacto' });
  }
});

// Ruta para eliminar un contacto
router.delete('/contacts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el contacto:', error);
    res.status(500).json({ message: 'Error al eliminar el contacto' });
  }
});

module.exports = router;

 