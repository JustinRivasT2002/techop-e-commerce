require('dotenv').config(); // Carga las variables de entorno desde .env
const sql = require('mssql');

// Configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 3000,
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

// obtener productos por ID
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
      const stockRequest = new sql.Request();

      stockRequest.input('producto_id', sql.Int, item.producto_id);
      stockRequest.input('cantidad', sql.Int, item.cantidad);

       const stockResult = await stockRequest.query(`
        SELECT cantidad FROM inventarios WHERE producto_id = @producto_id
      `);

      const stockDisponible = stockResult.recordset[0]?.cantidad || 0;

      if (stockDisponible < item.cantidad) {
        throw new Error(`❌ Stock insuficiente para el producto ID ${item.producto_id}`);
      }
    }

    // Datos personales del cliente
    request.input('email', sql.VarChar, pedidoData.email);
    request.input('nombre', sql.VarChar, pedidoData.nombre);
    request.input('telefono', sql.Int, pedidoData.telefono);
    request.input('direccion', sql.VarChar, pedidoData.direccion);

    // Verificar si el cliente existe por su email
    let clienteResult = await request.query(`
      SELECT id, nombre, telefono, direccion FROM clientes WHERE email = @email
    `);

    let clienteId;

    // Si el cliente no existe, lo registramos automáticamente
    if (clienteResult.recordset.length === 0) {
      console.log(`⚠️ Cliente con email ${pedidoData.email} no encontrado. Registrando automáticamente...`);

      await request.query(`
        INSERT INTO clientes (email, nombre, telefono, direccion)
        VALUES (@email, @nombre, @telefono, @direccion)
      `);

      // Obtener el nuevo cliente registrado
      clienteResult = await request.query(`
        SELECT id FROM clientes WHERE email = @email
      `);
    }  else {
      // Si el cliente ya existe, actualizamos sus datos (excepto el email)
      console.log(`🔄 Cliente existente encontrado. Actualizando datos...`);

      await request.query(`
        UPDATE clientes
        SET nombre = @nombre, telefono = @telefono, direccion = @direccion
        WHERE email = @email
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
      await new sql.Request().query(`
        INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (${pedidoId}, ${item.producto_id}, ${item.cantidad}, ${item.precio_unitario})
      `);
    }

    // Obtener los nombres de los productos por ID
    const ids = pedidoData.detalles.map(item => item.producto_id);
    const idsUnicos = [...new Set(ids)];

    const requestNombres = new sql.Request();
    const idsString = idsUnicos.join(',');

    const productosInfo = await requestNombres.query(`
      SELECT id, nombre FROM productos WHERE id IN (${idsString})
    `);

    // Mapea los nombres a los productos
    pedidoData.detalles = pedidoData.detalles.map(item => {
      const producto = productosInfo.recordset.find(p => p.id === item.producto_id);
      return {
        ...item,
        nombreProducto: producto?.nombre || 'Desconocido'
      };
    });

    // Crear objeto de detalles del pedido para el correo
    const productDetails = {
      email: pedidoData.email,
      nombreCliente: pedidoData.nombre,
      telefono: pedidoData.telefono,
      direccion: pedidoData.direccion,
      total: pedidoData.total,
      pedidoId: pedidoId,
      detalles: pedidoData.detalles,
    }

    console.log(`✅ Pedido creado con ID ${pedidoId}`);
    return { pedidoId, message: 'Pedido registrado correctamente.', emailData: productDetails };
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
