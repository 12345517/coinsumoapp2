const express = require("express");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const User = require('../User'); // Importa el modelo User
const Wallet = require('../Wallet'); // Importa el modelo Wallet
const { getUser, findPosition } = require("../../middleware/userMiddleware");

// Ruta para obtener todos los usuarios (solo para usuarios autenticados)
userRouter.get("/", authMiddleware, async (req, res) => {
  console.log("Ruta GET /users alcanzada"); // Verifica que la ruta se invoca
  try {
    const users = await User.find().populate("wallet"); // Población de billetera
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Ruta para crear un nuevo usuario
userRouter.post("/", async (req, res) => {
  const { idNumber, name, email, password, sponsorId } = req.body; // Incluye idNumber

  // Validaciones
  if (!idNumber || !name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Formato de correo electrónico inválido" });
  }

  // Validar longitud de la contraseña
  if (password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }

    // Encontrar la posición correcta en la matriz
    const position = await findPosition(sponsorId);

    // Crear el nuevo usuario
    const newUser = new User({
      idNumber, // Número de identificación
      name,
      email,
      password, // La contraseña se encriptará más tarde
      sponsorId,
      front: position.front,
      level: position.level,
      position: position.position,
    });

    // Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10); // Generar un salt
    newUser.password = await bcrypt.hash(newUser.password, salt); // Encriptar la contraseña

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Crear la billetera para el nuevo usuario
    const newWallet = new Wallet({ userId: newUser._id });
    await newWallet.save();

    // Asociar la billetera al usuario
    newUser.wallet = newWallet._id;
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ruta para obtener un usuario por ID (solo para usuarios autenticados)
userRouter.get("/:id", authMiddleware, getUser, (req, res) => {
  res.json(res.user);
});

// Ruta para obtener el saldo de puntos de un usuario
userRouter.get("/:id/points", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ totalPoints: user.totalPoints });
  } catch (error) {
    console.error('Error al obtener el saldo de puntos:', error);
    res.status(500).json({ message: 'Error al obtener el saldo de puntos' });
  }
});

// Ruta para obtener los referidos de un usuario (solo para usuarios autenticados)
userRouter.get("/:id/referrals", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('referrals');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user.referrals);
  } catch (error) {
    console.error('Error al obtener referidos:', error);
    res.status(500).json({ message: 'Error al obtener referidos' });
  }
});

// Exportar el router
module.exports = userRouter;
 