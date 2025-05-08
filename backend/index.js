const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./database/db');
const routes = require('./routes'); // Importar las rutas

const app = express();
const port = 3000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Conectar a la base de datos
connectDB();

// Usar las rutas
app.use('/', routes);

// Iniciar servidor
app.listen(port, () => console.log(`🚀 Servidor corriendo en el puerto ${port}`));
