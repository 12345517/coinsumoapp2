require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler'); // Correct import

const app = express();
app.use(express.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 4000;

// Configuración de CORS (ya está bien)
app.use(cors({
    origin: [
        'https://coinsumo.co',
        'http://localhost:4000',
        'https://www.coinsumo.co'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Limitar las solicitudes (rate limiting) (ya está bien)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
});

app.use('/api', apiLimiter);

// Rutas de la API (corregido)
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

app.use('/api/users', userRouter); // Quitar authMiddleware de algunas rutas
app.use('/api/afiliados', afiliadosRouter);
app.use('/api/thirdParties', thirdPartyRouter);
app.use('/api/wallet', authMiddleware, walletRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/points', pointsRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/users/backoffice', userBackOfficeRouter);
app.use('/api/domiciliarios', domiciliariosRouter);
app.use('/api/wholesalers', wholesalerRouter);
app.use('/api/entrepreneurs', entrepreneurRouter);
app.use('/api/collaborators', collaboratorRouter);
app.use('/api/crm', crmRouter);

// Ruta para admin (ya está bien)
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    res.send('Usuarios');
});

// Conexión a la base de datos MongoDB (corregido)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detener la ejecución si hay un error de conexión
    });

// Use the error-handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});