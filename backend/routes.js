const express = require('express');
const { getUsuarios, getProductos, getProductoById } = require('./database/db');
const { sendWelcomeEmail } = require('./services/mail_SMTP');

const router = express.Router();

// Registro de usuario y envío de correo
router.post('/register', async (req, res) => {
  const { email } = req.body;
  console.log('📩 Registrando usuario:', email);
  try {
    await sendWelcomeEmail(email);
    res.status(200).json({ message: '✅ Usuario registrado y correo enviado con éxito.' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.' });
  }
});

// Obtener usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    console.log('📜 Usuarios obtenidos:', usuarios);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener productos
router.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    console.log('🛒 Productos obtenidos:', productos);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 Buscando producto con ID: ${id}`);

  try {
    const producto = await getProductoById(id);
    if (producto) {
      console.log(`🛒 Producto obtenido (ID: ${id}):`, producto);
      res.json(producto);
    } else {
      console.warn(`⚠️ Producto con ID ${id} no encontrado`);
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(`❌ Error al obtener el producto:`, error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// routes.js
router.post('/comprar', async (req, res) => {
  const sql = require('mssql');
  const { cliente_id, metodo_pago_id, estado_envio_id, productos } = req.body;

  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Calcular total del pedido
    const total = productos.reduce((sum, p) => sum + p.precio_unitario * p.cantidad, 0);

    // Insertar pedido y obtener su ID
    const resultPedido = await request.query(`
      INSERT INTO pedidos (cliente_id, total, metodo_pago_id, estado_envio_id)
      OUTPUT INSERTED.id AS pedido_id
      VALUES (${cliente_id}, ${total}, ${metodo_pago_id}, ${estado_envio_id});
    `);
    const pedido_id = resultPedido.recordset[0].pedido_id;

    // Insertar detalles del pedido y actualizar inventario
    for (const producto of productos) {
      const { producto_id, cantidad, precio_unitario } = producto;

      // Insertar detalle
      await request.query(`
        INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (${pedido_id}, ${producto_id}, ${cantidad}, ${precio_unitario});
      `);

      // Validar stock antes de restar (buena práctica)
      const stockCheck = await request.query(`
        SELECT cantidad FROM inventarios WHERE producto_id = ${producto_id};
      `);
      const stockActual = stockCheck.recordset[0]?.cantidad;

      if (stockActual === undefined || stockActual < cantidad) {
        throw new Error(`Stock insuficiente para producto ID ${producto_id}`);
      }

      // Actualizar inventario
      await request.query(`
        UPDATE inventarios
        SET cantidad = cantidad - ${cantidad}
        WHERE producto_id = ${producto_id};
      `);
    }

    // Confirmar transacción
    await transaction.commit();
    res.status(201).json({ message: 'Compra realizada con éxito', pedido_id });

  } catch (error) {
    console.error('❌ Error al procesar la compra:', error.message);
    await transaction.rollback();
    res.status(500).json({ error: 'Error al procesar la compra', detalle: error.message });
  }
});


module.exports = router;
