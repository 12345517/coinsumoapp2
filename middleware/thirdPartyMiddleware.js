const ThirdParty = require('../models/ThirdParty'); // Asegúrate de que la ruta sea correcta

async function getThirdParty(req, res, next) {
  try {
    const thirdParty = await ThirdParty.findById(req.params.id).populate('wallet');
    if (thirdParty == null) {
      return res.status(404).json({ message: 'Tercero no encontrado' });
    }
    res.thirdParty = thirdParty; // Agrega el tercero al objeto de respuesta
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { getThirdParty };
 