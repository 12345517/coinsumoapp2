const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Point = require('../models/Point');

// Crear una nueva compra
router.post('/', async (req, res) => {
  const userId = req.body.userId;
  const thirdPartyId = req.body.thirdPartyId;
  const purchaseValue = req.body.purchaseValue;

  try {
    const purchase = new Purchase({
      userId: userId,
      thirdPartyId: thirdPartyId,
      purchaseValue: purchaseValue
    });
    const savedPurchase = await purchase.save();

    // Calcular los puntos ganados por la compra
    const pointsEarned = calculatePoints(purchaseValue); 

    // Registrar los puntos ganados para el usuario
    await Point.create({ userId: userId, thirdPartyId: thirdPartyId, points: pointsEarned });

    // Actualizar el saldo de la billetera del usuario
    const user = await User.findById(userId).populate('wallet');
    user.wallet.balance += purchaseValue;
    await user.save();

    // Distribuir la comisión a la plataforma y al patrocinador
    const commission = calculateCommission(purchaseValue);
    const sponsor = await User.findById(user.sponsorId);
    const thirdParty = await ThirdParty.findById(thirdPartyId); // Obtener el tercero

    if (sponsor) {
      sponsor.wallet.balance += commission.sponsorCommission;
      await sponsor.save();
    }

    // Distribuir la comisión al tercero
    if (thirdParty) {
      thirdParty.wallet.balance += commission.thirdPartyCommission;
      await thirdParty.save();
    }

    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Función para calcular puntos ganados por la compra
async function calculatePoints(purchaseValue) {
  // Define aquí la lógica para calcular los puntos 
  // a partir del valor de la compra
  // Puedes usar una fórmula fija o una lógica más compleja
  // (por ejemplo,  un porcentaje del valor de la compra)

  // Ejemplo simple: 1 punto por cada $1 de compra
  const points = purchaseValue; 

  return points;
}

// Función para calcular la comisión
async function calculateCommission(purchaseValue) {
  // Implementar la lógica para calcular las comisiones
  // Ejemplo: 5% para la plataforma, 2% para el usuario, 1% para el patrocinador
  const commission = {
    platformCommission: purchaseValue * 0.05,
    sponsorCommission: purchaseValue * 0.01,
    thirdPartyCommission: purchaseValue * 0.02 // Ejemplo de comisión para el tercero
  };

  return commission;
}

module.exports = router;