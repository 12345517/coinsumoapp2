 const express = require('express');
const Point = require('../../models/Point');
const User = require('../../models/User');

// ... (Otras funciones de la matriz)

// Función para distribuir puntos en la red de afiliados
const distributePoints = async (user, purchaseAmount) => {
  try {
    let currentLevel = user.level + 1; // Comenzar desde el nivel del patrocinador
    let remainingAmount = purchaseAmount * 0.1; // 10% de la compra
    let coinsumoPercentage = 0.3; // 30% para Coinsumo
    let networkPercentage = 1 - coinsumoPercentage; // 70% para la red

    // Asignar el porcentaje a Coinsumo
    let coinsumoPoints = remainingAmount * coinsumoPercentage;

    // Distribuir puntos en los niveles ascendentes
    while (remainingAmount > 0 && currentLevel <= 10) {
      // Encuentra el patrocinador en el nivel actual
      let sponsor = await User.findById(user.sponsor);

      // Verificar si el patrocinador existe y no es el propio usuario
      if (sponsor && sponsor._id.toString() !== user._id.toString()) {
        // Calcular los puntos para el patrocinador
        let sponsorPoints = 0;
        if (currentLevel === 2) {
          sponsorPoints = remainingAmount * 0.2; // 20% para el nivel 2
          remainingAmount -= sponsorPoints;
        } else {
          sponsorPoints = remainingAmount / 9; // Dividir el resto entre los 9 niveles restantes
          remainingAmount -= sponsorPoints;
        }

        // Actualizar los puntos del patrocinador
        sponsor.totalPoints += sponsorPoints;
        await sponsor.save();

        // Registrar la transacción de puntos para el patrocinador
        const newPointTransaction = new Point({
          userId: sponsor._id,
          amount: sponsorPoints
        });
        await newPointTransaction.save();
      }

      currentLevel++; // Subir al siguiente nivel
    }
  } catch (error) {
    console.error('Error al distribuir puntos:', error);
    // Puedes manejar el error de manera apropiada aquí
  }
};

module.exports = {
  // ... (otras funciones de la matriz)
  distributePoints
};
 
 