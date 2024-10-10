const express = require('express');
const router = express.Router();
//const ThirdParty = require('../models/ThirdParty');
const thirdParty = require('../ThirdParty');
//const Wallet = require('../models/Wallet');
const Wallet = require('../../models/Wallet');
const { getThirdParty } = require('../../middleware/thirdPartyMiddleware'); // Importa el middleware
//const ThirdParty = new thirdParty();

// Crear un nuevo tercero
router.post('/', async (req, res) => {
  const { name, apiId, apiUrl } = req.body;

  try {
    const existingThirdParty = await ThirdParty.findOne({ apiId: apiId });
    if (existingThirdParty) {
      return res.status(400).json({ message: 'El ID de API ya está en uso' });
    }

    // Crear la billetera para el nuevo tercero
    const newWallet = new Wallet({ thirdPartyId: thirdParty._id });
    await newWallet.save();

    // Crear el nuevo tercero
    const newThirdParty = new ThirdParty({
      name: name,
      apiId: apiId,
      apiUrl: apiUrl,
      wallet: newWallet._id
    });
    await newThirdParty.save();

    res.status(201).json(newThirdParty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los terceros
router.get('/', async (req, res) => {
  try {
    const thirdParties = await ThirdParty.find().populate('wallet');
    res.json(thirdParties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un tercero por ID
router.get('/:id', getThirdParty, (req, res) => {
  res.json(res.thirdParty);
});

//Actualizar un tercero por ID
router.patch('/:id', getThirdParty, async (req, res) => {
  try {
    const updatedThirdParty = await ThirdParty.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.json(updatedThirdParty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;