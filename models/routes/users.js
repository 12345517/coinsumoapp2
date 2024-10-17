const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { getUser, findPosition } = require("../../middleware/userMiddleware");
const User = require('../User');
const Wallet = require('../Wallet');
const authMiddleware = require('../../middleware/authMiddleware');

// Registro de Usuario
userRouter.post('/registro', async (req, res, next) => {
  // ... (código de validación y registro - ya está bien) ...
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