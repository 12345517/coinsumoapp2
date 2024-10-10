const express = require('express');
const router = express.Router();
const User = require('../User');
const authMiddleware = require('../../middleware/authMiddleware');

// Ruta para obtener información del backoffice
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Obtener el usuario actual
    const currentUser = req.user;

    // Obtener los tres primeros referidos directos del usuario actual
    const topThreeReferrals = await User.find({ sponsor: currentUser._id }).limit(3);

    // Calcular el total de puntos del resto de la red (excluyendo al usuario actual y sus tres primeros referidos)
    const totalPointsRestOfNetwork = await User.aggregate([
      { $match: { sponsor: { $ne: currentUser._id }, _id: { $nin: topThreeReferrals.map(r => r._id) } } }, // Excluir usuario actual y top 3
      { $group: { _id: null, totalPoints: { $sum: "$totalPoints" } } }
    ]);

    // Formatear la respuesta
    const backOfficeData = {
      topThreeReferrals: topThreeReferrals.map(referral => ({
        name: referral.name,
        totalPoints: referral.totalPoints
      })),
      totalPointsRestOfNetwork: totalPointsRestOfNetwork.length > 0 ? totalPointsRestOfNetwork[0].totalPoints : 0
    };

    res.json(backOfficeData);
  } catch (error) {
    console.error('Error al obtener la información del backoffice:', error);
    res.status(500).json({ message: 'Error al obtener la información del backoffice' });
  }
});

module.exports = router;
