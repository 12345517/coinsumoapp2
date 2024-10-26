require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const crypto = require('crypto'); // Importar el módulo crypto para generar el nonce
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { authMiddleware, adminMiddleware } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.NEW_PORT || 5009; // Cambiar el puerto a 5009

app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: [
        'https://coinsumo.co',
        'http://localhost:5009',
        'https://www.coinsumo.co'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // Asegúrate de que la ruta sea correcta

// Middleware para generar un nonce y agregarlo a las respuestas
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${res.locals.nonce}'`);
    next();
});

// Middleware para registrar todas las solicitudes y respuestas
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`Response Status: ${res.statusCode}`);
    });
    next();
});

// Rutas de la API
const userRouter = require('./routes/users');
const afiliadosRouter = require('./routes/afiliados');
const thirdPartyRouter = require('./routes/thirdParties');
const walletRouter = require('./routes/wallet');
const transactionRouter = require('./routes/transactions');
const pointsRouter = require('./routes/points');
const purchasesRouter = require('./routes/purchases');
const userBackOfficeRouter = require('./routes/userbackoffice');
const domiciliariosRouter = require('./routes/domiciliarios');
const wholesalerRouter = require('./routes/wholesalers');
const entrepreneurRouter = require('./routes/entrepreneurs');
const collaboratorRouter = require('./routes/collaborators');
const crmRouter = require('./routes/crm');

app.use('/api/users', userRouter);
app.use('/api/auth', authRoutes); // Usa auth routes
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
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    res.send('Usuarios');
});

// Rutas para archivos estáticos
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register', { nonce: res.locals.nonce });
});

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/users.html'));
});

app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/reset-password.html'));
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error("Error:", err.stack); // Imprime la pila de llamadas para depuración
    res.status(500).json({ message: 'Error del servidor', error: err.message, stack: err.stack }); // Envía más información al cliente
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
