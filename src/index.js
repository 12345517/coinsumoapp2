require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const errorHandler = require('../middleware/errorHandler');
//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';
//import '../public/styles.css'; // Importa el archivo de estilos desde el directorio public


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Configuración de CORS
app.use(cors({
    origin: [
        'https://coinsumo.co',
        'http://localhost:4000',
        'https://www.coinsumo.co'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Limitar las solicitudes (rate limiting)
//const apiLimiter = rateLimit({
///    windowMs: 15 * 60 * 1000, // 15 minutos
////    max: 100, // Limita cada IP a 100 solicitudes por ventana de 15 minutos
//    message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
///});

//app.use('/api', apiLimiter);

// Rutas de la API
const userRouter = require('../models/routes/users');
const afiliadosRouter = require('../models/routes/afiliados');
const thirdPartyRouter = require('../models/routes/thirdParties');
const walletRouter = require('../models/routes/wallet');
const transactionRouter = require('../models/routes/transactions');
const pointsRouter = require('../models/routes/points');
const purchasesRouter = require('../models/routes/purchases');
const userBackOfficeRouter = require('../models/routes/userbackoffice');
const domiciliariosRouter = require('../models/routes/domiciliarios');
const wholesalerRouter = require('../models/routes/wholesalers');
const entrepreneurRouter = require('../models/routes/entrepreneurs');
const collaboratorRouter = require('../models/routes/collaborators');
const crmRouter = require('../models/routes/crm');

app.use('/api/users', userRouter);
app.use('/api/afiliados', afiliadosRouter);
app.use('/api/thirdParties', thirdPartyRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/points', pointsRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/users/backoffice', userBackOfficeRouter);
app.use('/api/domiciliarios', domiciliariosRouter);
app.use('/api/wholesalers', wholesalerRouter);
app.use('/api/entrepreneurs', entrepreneurRouter);
app.use('/api/collaborators', collaboratorRouter);
app.use('/api/crm', crmRouter);

// Ruta para admin
app.get('/api/admin/users', authMiddleware.authMiddleware, adminMiddleware, async (req, res) => {
    res.send('Usuarios');
});

app.get('/', (req, res) => {
    res.render('index');
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detener la ejecución si hay un error de conexión
    });

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware de manejo de errores adicional
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
