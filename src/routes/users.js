const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { getUser, findPosition } = require("../middleware/userMiddleware");
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const authMiddleware = require('../middleware/authMiddleware');
const security = require('../security/password');

userRouter.get("/", async (req, res) => {
 /*  try {
    const user = new User({
    idNumber: '123456789',
    name: 'Juan Perez',
    email: 'prueba@example.com',
    password: '123456',
    whatsapp: '1234567890',
    pais: 'Colombia',
    departamento: 'Antioquia',
    ciudad: 'Medellin',
    direccion: 'Calle 123',
    role: 'cliente',
    });

    user.save();
  }catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  } */

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Registro de Usuario
userRouter.post('/registro', async (req, res, next) => {
  const { idNumber, name, email, password, sponsorId } = req.body;

  // Validaciones
  if (!idNumber || !name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
  }

  // Validar longitud de la contraseña
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Encontrar la posición correcta en la matriz
    const position = await findPosition(sponsorId);

    const hashedPassword = await security.encryptPassword(password);

    // Crear el nuevo usuario
    const newUser = new User({
      idNumber,
      name,
      email,
      password: hashedPassword,
      sponsorId,
      front: position.front,
      level: position.level,
      position: position.position,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
});

// Inicio de Sesión (ya está bien)
userRouter.post('/login', async (req, res) => {
  // ... (código de inicio de sesión - ya está bien) ...
});

// Ruta para obtener un usuario por ID (solo para usuarios autenticados)
userRouter.get("/:id", authMiddleware.authMiddleware, getUser, (req, res) => {
  res.json(res.user);
});

// Ruta para obtener el saldo de puntos de un usuario (corregido)
userRouter.get("/:id/points", authMiddleware.authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ totalPoints: user.points || 0 }); // Usa user.points o 0 si no existe
  } catch (error) {
    console.error('Error al obtener el saldo de puntos:', error);
    res.status(500).json({ message: 'Error al obtener el saldo de puntos' });
  }
});

// Ruta para obtener los referidos de un usuario (ya está bien)
userRouter.get("/:id/referrals", authMiddleware.authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('referrals');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user.referrals);
  } catch (error) {
    console.error('Error al obtener los referidos:', error);
    res.status(500).json({ message: 'Error al obtener los referidos' });
  }
});

module.exports = userRouter;