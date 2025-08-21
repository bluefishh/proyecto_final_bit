require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares básicos
app.use(cors()); // Cors para permitir solicitudes de diferentes orígenes
app.use(express.json()); // body parser JSON para analizar el cuerpo de las solicitudes

// Importar rutas
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const alertaRoutes = require('./routes/alerta');
const campanniaReciclajeRoutes = require('./routes/campanniaReciclaje');
const comercioLocalRoutes = require('./routes/comercioLocal');
const comunidadRoutes = require('./routes/comunidad');
const horarioRecoleccionResiduosRoutes = require('./routes/horarioRecoleccionResiduos');
const puntoReciclajeRoutes = require('./routes/puntoReciclaje');
const usuarioRoutes = require('./routes/usuario');

// Rutas
app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/alertas', alertaRoutes);
app.use('/campannias', campanniaReciclajeRoutes);
app.use('/comercios', comercioLocalRoutes);
app.use('/comunidades', comunidadRoutes);
app.use('/horarios', horarioRecoleccionResiduosRoutes);
app.use('/puntos', puntoReciclajeRoutes);
app.use('/usuarios', usuarioRoutes);

// Conexión a la base de datos MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado a MongoDB");
}).catch(error => {
    console.error("Error al conectar a MongoDB:", error);
});

// Iniciar el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`API/servidor corriendo en http://localhost:${PORT}`);
});