const User = require('../models/User'); // Asegúrate de que la ruta sea correcta

const validateUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        //Validación para comprobar si userId es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId inválido' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        req.user = user; // Añade el usuario al objeto request para usarlo más tarde
        next();
    } catch (error) {
        console.error('Error al validar userId:', error);
        res.status(500).json({ message: 'Error al validar userId' });
    }
};

module.exports = validateUserId;
 