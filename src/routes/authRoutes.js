const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para verificar email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token
    });
    if (!user) return res.status(400).send('Email verification token is invalid or has expired.');

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.status(200).send('Email has been verified.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para solicitar restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User with this email does not exist.');

    user.generatePasswordReset();
    await user.save();

    const resetLink = `http://localhost:4000/reset-password/${user.resetPasswordToken}`;

    // Enviar correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetLink}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error: ', err);
        return res.status(500).send('Error sending email.');
      }
      res.status(200).send('Recovery email sent.');
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para restablecer la contraseña
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).send('Invalid token or user does not exist.');
    }

    // Actualizar la contraseña
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).send('Password reset successfully');
  } catch (error) {
    res.status(500).send('Error resetting password: ' + error.message);
  }
});

module.exports = router;