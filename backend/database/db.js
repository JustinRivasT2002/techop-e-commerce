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

// Conectar base de datos
const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    process.exit(1); // Salir si falla la conexión
  }
};

// obtener clientes
const getUsuarios = async () => {
  try {
    const result = await sql.query('SELECT * FROM clientes');
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
};

// Registrar nuevo cliente en la base de datos
const registrarCliente = async (email) => {
  try {
    const request = new sql.Request();
    request.input('email', sql.VarChar, email);

    // Verificar si el cliente ya existe
    const checkClient = await request.query(`
      SELECT id FROM clientes WHERE email = @email
    `);

    if (checkClient.recordset.length > 0) {
      return { message: 'El cliente ya está registrado.', registrado: false };
    }

    // Insertar nuevo cliente con valores NULL en nombre, teléfono y dirección
    await request.query(`
      INSERT INTO clientes (email, nombre, telefono, direccion)
      VALUES (@email, NULL, NULL, NULL)
    `);

    return { message: 'Cliente registrado correctamente.', registrado: true };
  } catch (error) {
    console.error('❌ Error al registrar cliente:', error);
    throw error;
  }
};

// obtener productos
const getProductos = async () => {
  try {
    const result = await sql.query(`
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
             c.id AS categoria_id, c.nombre AS categoria_nombre
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
    `);
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
};

// obtener clientes por ID
const getProductoById = async (id) => {
  try {
    const request = new sql.Request();
    request.input('id', sql.Int, id); // Pasar el ID como parámetro de entrada
    const result = await request.query(`
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen,
             c.id AS categoria_id, c.nombre AS categoria_nombre,
             COALESCE(i.cantidad, 0) AS stock_disponible
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN inventarios i ON p.id = i.producto_id
      WHERE p.id = @id
    `);

    return result.recordset[0];
  } catch (error) {
    console.error('❌ Error al obtener el producto por ID:', error);
    throw error; // Lanza el error para que el controlador lo maneje
  }
};

// Obtener un metodo de pago
const getMetodosPago = async () => {
  try {
    const result = await sql.query(`
      SELECT id, metodo AS nombre FROM metodos_pago
    `);
    return result.recordset;
  } catch (error) {
    console.error('❌ Error al obtener métodos de pago:', error);
    throw error;
  }
};

// Crear un pedido
const crearPedido = async (pedidoData) => {
  try {
    const request = new sql.Request();

    // Verificar stock antes de cualquier otra operación
    for (const item of pedidoData.detalles) {
      request.input('producto_id', sql.Int, item.producto_id);
      request.input('cantidad', sql.Int, item.cantidad);

      const stockResult = await request.query(`
        SELECT cantidad FROM inventarios WHERE producto_id = @producto_id
      `);

      const stockDisponible = stockResult.recordset[0]?.cantidad || 0;

      if (stockDisponible < item.cantidad) {
        throw new Error(`❌ Stock insuficiente para el producto ID ${item.producto_id}`);
      }
    }

    // Verificar si el cliente existe por su email
    request.input('email', sql.VarChar, pedidoData.email);
    let clienteResult = await request.query(`
      SELECT id FROM clientes WHERE email = @email
    `);

    let clienteId;

    // Si el cliente no existe, lo registramos automáticamente
    if (clienteResult.recordset.length === 0) {
      console.log(`⚠️ Cliente con email ${pedidoData.email} no encontrado. Registrando automáticamente...`);

      await request.query(`
        INSERT INTO clientes (email, nombre, telefono, direccion)
        VALUES (@email, NULL, NULL, NULL)
      `);

      // Obtener el nuevo cliente registrado
      clienteResult = await request.query(`
        SELECT id FROM clientes WHERE email = @email
      `);
    }

    clienteId = clienteResult.recordset[0].id;

    // Insertar el pedido en la tabla pedidos
    request.input('cliente_id', sql.Int, clienteId);
    request.input('total', sql.Decimal(10,2), pedidoData.total);
    request.input('metodo_pago_id', sql.Int, pedidoData.metodo_pago_id);

    const pedidoResult = await request.query(`
      INSERT INTO pedidos (cliente_id, total, metodo_pago_id, estado_envio_id)
      OUTPUT INSERTED.id
      VALUES (@cliente_id, @total, @metodo_pago_id, 1)
    `);

    const pedidoId = pedidoResult.recordset[0].id;

    // Insertar los productos en detalles_pedido
    for (const item of pedidoData.detalles) {
      request.input('producto_id', sql.Int, item.producto_id);
      request.input('cantidad', sql.Int, item.cantidad);
      request.input('precio_unitario', sql.Decimal(10,2), item.precio_unitario);

      await request.query(`
        INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (${pedidoId}, @producto_id, @cantidad, @precio_unitario)
      `);
    }

    console.log(`✅ Pedido creado con ID ${pedidoId}`);
    return { pedidoId, message: 'Pedido registrado correctamente.' };
  } catch (error) {
    console.error('❌ Error al crear el pedido:', error);
    throw error;
  }
};

// Exportar todas las consultas
module.exports = {
  connectDB,
  getUsuarios,
  getProductos,
  getProductoById,
  getMetodosPago,
  registrarCliente,
  crearPedido
};
