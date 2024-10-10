require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware'); // Asegúrate de crear este archivo


console.log('Intentando cargar el modelo User');

const User = require('./models/User'); 

// Rutas de la API
const userRouter = require('./models/routes/users');
const afiliadosRouter = require('./models/routes/afiliados'); 
const thirdPartyRouter = require('./models/routes/thirdParties');
const walletRouter = require('./models/routes/wallet');
const transactionRouter = require('./models/routes/transactions');
const pointsRouter = require('./models/routes/points');
const purchasesRouter = require('./models/routes/purchases');
const userBackOfficeRouter = require('./models/routes/userbackoffice');
const domiciliariosRouter = require('./models/routes/domiciliarios');
const wholesalerRouter = require('./models/routes/wholesalers');
const entrepreneurRouter = require('./models/routes/entrepreneurs');
const collaboratorRouter = require('./models/routes/collaborators');
const crmRouter = require('./models/routes/crm');

const app = express(); 
// Usa la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 4000; // cambio a otro puerto temporalmente

// Configuración de CORS
app.use(cors({
    origin: [
                'https://coinsumo.co', 
                'http://localhost:4000', // Agrega localhost para desarrollo
                'https://www.coinsumo.co'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(helmet());


// Rutas de la API
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/afiliados', authMiddleware, afiliadosRouter); 
app.use('/api/thirdParties', authMiddleware, thirdPartyRouter);
app.use('/api/wallet', authMiddleware, walletRouter);
app.use('/api/transactions', authMiddleware, transactionRouter);
app.use('/api/points', authMiddleware, pointsRouter);
app.use('/api/purchases', authMiddleware, purchasesRouter);
app.use('/api/users/backoffice', authMiddleware, userBackOfficeRouter);
app.use('/api/domiciliarios', authMiddleware, domiciliariosRouter);
app.use('/api/wholesalers', wholesalerRouter); 
app.use('/api/entrepreneurs', entrepreneurRouter); 
app.use('/api/collaborators', authMiddleware, collaboratorRouter);
app.use('/api/crm', authMiddleware, crmRouter);

//Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

// Limitar las solicitudes (rate limiting)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limitar a 1000 solicitudes
    message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
});

app.use('/api', apiLimiter); 

//Ruta para admin
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    // Lógica para listar usuarios
    res.send('Usuarios');
});


app.listen(4000, () => {
    console.log('Servidor corriendo en http://localhost:4000');
});