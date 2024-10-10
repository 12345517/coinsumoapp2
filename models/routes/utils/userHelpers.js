const User = require('../models/User');

// Función intermedia para obtener un usuario por ID
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).populate('wallet');
    if (user == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Función para encontrar la posición en la matriz
async function findPosition(sponsorId) {
  let position = { front: 0, level: 1, position: 0 }; // Posición inicial

  if (sponsorId) {
    const sponsor = await User.findById(sponsorId);
    if (!sponsor) {
      return res.status(404).json({ message: 'Patrocinador no encontrado' }); 
    }

    // Si el patrocinador está en el nivel 10, el nuevo usuario va al nivel 11
    if (sponsor.level === 10) {
      position.level = 11; // (Puedes manejar este caso como quieras)
      return position;
    }

    // Buscar la posición libre en el siguiente nivel
    for (let front = 0; front < 3; front++) {
      for (let pos = 0; pos < 10; pos++) {
        const user = await User.findOne({
          front: front,
          level: sponsor.level + 1,
          position: pos,
        });

        if (!user) {
          position.front = front;
          position.level = sponsor.level + 1;
          position.position = pos;
          return position;
        }
      }
    }
  }

  return position; // Si no se encuentra una posición libre,  devolver la inicial
}

module.exports = { getUser, findPosition };  