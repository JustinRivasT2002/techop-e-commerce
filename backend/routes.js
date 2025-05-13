const express = require('express');
const {
  getUsuarios,
  getProductos,
  getProductoById,
  getMetodosPago,
  registrarCliente,
  crearPedido
} = require('./database/db');
const { sendWelcomeEmail, sendOrderConfirmationEmail } = require('./services/mail_SMTP');

const router = express.Router();

// Registro de usuario y envío de correo + registro en la base de datos
router.post('/register', async (req, res) => {
  const { email } = req.body;
  console.log('📩 Registrando usuario:', email);

  try {
    // Registrar usuario en la base de datos
    const result = await registrarCliente(email);

    // Enviar correo solo si el usuario fue registrado
    if (result.registrado) {
      await sendWelcomeEmail(email);
      console.log('✅ Cliente registrado y correo enviado.');
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('❌ Error en el registro:', error);
    res.status(500).json({ error: 'Error en el registro.' });
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

// Obtener métodos de pago
router.get('/metodos-pago', async (req, res) => {
  try {
    const metodos = await getMetodosPago();
    console.log('💳 Métodos de pago obtenidos:', metodos);
    res.json(metodos);
  } catch (error) {
    console.error('❌ Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
});

// Obtener productos por ID
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

// Crear un pedido
router.post('/create-order', async (req, res) => {
  const pedidoData = req.body;
  console.log('🛒 Creando pedido:', pedidoData);

  try {
    const result = await crearPedido(pedidoData);

    // Enviar correo de confirmación
    await sendOrderConfirmationEmail(pedidoData);

    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Error al registrar el pedido:', error);
    res.status(500).json({ error: 'Error al registrar el pedido.' });
  }
});

module.exports = router;
