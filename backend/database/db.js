require('dotenv').config(); // Carga las variables de entorno desde .env
const sql = require('mssql');

// Configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: JSON.parse(process.env.DB_OPTIONS_ENCRYPT),
    trustServerCertificate: JSON.parse(process.env.DB_OPTIONS_TRUST_SERVER_CERTIFICATE),
  },
};

const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    process.exit(1); // Salir si falla la conexión
  }
};

const getUsuarios = async () => {
  try {
    const result = await sql.query('SELECT * FROM clientes');
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
};

const getProductos = async () => {
  try {
    const result = await sql.query('SELECT * FROM productos');
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
};

const getProductoById = async (id) => {
  try {
    const request = new sql.Request(); // Crear una nueva solicitud para la base de datos
    request.input('id', sql.Int, id); // Pasar el ID como parámetro de entrada
    const result = await request.query('SELECT * FROM productos WHERE id = @id'); // Consulta parametrizada

    return result.recordset[0]; // Devuelve solo el primer resultado
  } catch (error) {
    console.error('❌ Error al obtener el producto por ID:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  }
};


module.exports = { connectDB, getUsuarios, getProductos, getProductoById };
