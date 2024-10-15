const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de la ruta correcta
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registro de Colaborador
router.post('/register', async (req, res) => {
  // ... (Implementación de registro, validaciones, encriptación de contraseña, etc.) ...
});

//Inicio de Sesión de Colaborador
router.post('/login', async (req, res) => {
  // ... (Implementación de inicio de sesión, validaciones, generación de token, etc.) ...
});

module.exports = router;
 