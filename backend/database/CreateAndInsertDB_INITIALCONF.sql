-- Crear tabla de Clientes
CREATE TABLE clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT
);

-- Crear tabla de Categorías
CREATE TABLE categorias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Crear tabla de Productos con la nueva columna de imagen
CREATE TABLE productos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    imagen VARCHAR(255), -- Nueva columna para la imagen del producto
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Crear tabla de Métodos de Pago
CREATE TABLE metodos_pago (
    id INT IDENTITY(1,1) PRIMARY KEY,
    metodo VARCHAR(50) NOT NULL
);

-- Crear tabla de Estado de Envío
CREATE TABLE estados_envio (
    id INT IDENTITY(1,1) PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);

-- Crear tabla de Pedidos
CREATE TABLE pedidos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT GETDATE(),
    total DECIMAL(10,2) NOT NULL,
    metodo_pago_id INT NOT NULL,
    estado_envio_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id),
    FOREIGN KEY (estado_envio_id) REFERENCES estados_envio(id)
);

-- Crear tabla de Detalles del Pedido
CREATE TABLE detalles_pedido (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal AS (cantidad * precio_unitario) PERSISTED,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Crear tabla de Inventarios
CREATE TABLE inventarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    ultima_actualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Insertar datos de prueba en Categorías
INSERT INTO categorias (nombre) VALUES
('Laptops'),
('Componentes'),
('Accesorios'),
('Monitores'),
('Impresoras'),
('Tablets'),
('Teléfonos Móviles'),
('Smartwatches'),
('Auriculares'),
('Dispositivos de Audio'),
('Cámaras'),
('Discos Duros'),
('Memorias USB'),
('Redes y Conectividad'),
('Software'),
('Juegos'),
('Teclados'),
('Mouse'),
('Sillas Gaming'),
('Estaciones de Trabajo'),
('Electrodomésticos Inteligentes'),
('Drones'),
('VR y AR'),
('Robótica'),
('Paneles Solares'),
('Servidores'),
('Equipos de Oficina'),
('Proyectores'),
('Consolas de Videojuegos'),
('Periféricos para Consolas'),
('Componentes Automotrices'),
('Equipos Industriales'),
('Hogar Inteligente'),
('Accesorios para Móviles'),
('Cables y Adaptadores'),
('Fuentes de Poder'),
('Tarjetas Gráficas'),
('Placas Base'),
('Procesadores'),
('Refrigeración para PCs'),
('Almacenamiento NAS'),
('Seguridad Electrónica'),
('Carcasas para PCs'),
('Iluminación LED'),
('Kits de Desarrollo Electrónico'),
('Equipos Médicos Tecnológicos');


-- Insertar 50 productos con datos de prueba
INSERT INTO productos (nombre, descripcion, precio, categoria_id, stock, imagen) VALUES
('Laptop Gamer ASUS', 'Potente laptop para gaming', 1500.00, 1, 10, 'https://example.com/images/laptop1.jpg'),
('Tarjeta Gráfica RTX 4080', 'Gráfica de última generación', 1200.00, 2, 5, 'https://example.com/images/graphic1.jpg'),
('Teclado Mecánico RGB', 'Teclado mecánico retroiluminado', 100.00, 3, 20, 'https://example.com/images/keyboard1.jpg'),
('Monitor 4K Samsung', 'Monitor UHD de alta calidad', 300.00, 3, 15, 'https://example.com/images/monitor1.jpg'),
('Mouse Gaming Logitech', 'Mouse ergonómico para gamers', 50.00, 3, 25, 'https://example.com/images/mouse1.jpg'),
('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido', 350.00, 3, 10, 'https://example.com/images/headphones1.jpg'),
('SSD NVMe 1TB Samsung', 'Unidad de almacenamiento ultrarrápida', 200.00, 2, 30, 'https://example.com/images/ssd1.jpg'),
('Laptop Dell XPS 15', 'Laptop premium para trabajo y entretenimiento', 1800.00, 1, 8, 'https://example.com/images/laptop2.jpg'),
('Tarjeta Madre MSI Z690', 'Placa base de alto rendimiento', 250.00, 2, 12, 'https://example.com/images/motherboard1.jpg'),
('Fuente de Poder EVGA 750W', 'Fuente de poder modular', 120.00, 2, 7, 'https://example.com/images/psu1.jpg'),
('RAM Corsair Vengeance 32GB', 'Memoria RAM DDR4 de alta velocidad', 150.00, 2, 20, 'https://example.com/images/ram1.jpg'),
('Gabinete NZXT H510', 'Gabinete para PC con diseño moderno', 100.00, 2, 5, 'https://example.com/images/case1.jpg'),
('Portátil HP Envy 13', 'Portátil compacto y ligero', 1100.00, 1, 12, 'https://example.com/images/laptop3.jpg'),
('Teclado Microsoft Surface', 'Teclado elegante y ligero', 150.00, 3, 17, 'https://example.com/images/keyboard2.jpg'),
('Micrófono Blue Yeti', 'Micrófono USB profesional', 130.00, 3, 6, 'https://example.com/images/microphone1.jpg'),
('Switch Cisco SG350', 'Switch gestionable de 24 puertos', 600.00, 2, 3, 'https://example.com/images/switch1.jpg'),
('Cámara Web Logitech C920', 'Cámara HD para videoconferencias', 90.00, 3, 22, 'https://example.com/images/webcam1.jpg'),
('Tablet Samsung Galaxy Tab S8', 'Tablet potente para entretenimiento', 700.00, 1, 4, 'https://example.com/images/tablet1.jpg'),
('Impresora Epson EcoTank', 'Impresora con bajo consumo de tinta', 250.00, 3, 10, 'https://example.com/images/printer1.jpg'),
('Disco Duro Externo 2TB', 'Almacenamiento portátil', 120.00, 3, 15, 'https://example.com/images/externalhdd1.jpg'),
-- Continúa con los 30 productos restantes, asegurándote de variar las descripciones y categorías
('Altavoz Bluetooth JBL', 'Altavoz portátil con excelente sonido', 150.00, 3, 18, 'https://example.com/images/speaker1.jpg'),
('Procesador Intel Core i9', 'Procesador de alto rendimiento', 500.00, 2, 8, 'https://example.com/images/cpu1.jpg'),
('Adaptador WiFi USB TP-Link', 'Conexión WiFi rápida y estable', 30.00, 3, 25, 'https://example.com/images/wifiadapter1.jpg'),
('Consola Xbox Series X', 'Consola de videojuegos de última generación', 500.00, 3, 12, 'https://example.com/images/xbox1.jpg'),
('Smartwatch Apple Watch Series 8', 'Reloj inteligente con múltiples funciones', 400.00, 3, 9, 'https://example.com/images/smartwatch1.jpg');

-- Insertar datos de prueba en Métodos de Pago
INSERT INTO metodos_pago (metodo) VALUES
('Tarjeta de Crédito'),
('PayPal'),
('Transferencia Bancaria'),
('Apple Pay'),
('Google Pay'),
('Bizum'),
('Criptomonedas'),
('Tarjeta de Débito');

-- Insertar datos de prueba en Estado de Envío
INSERT INTO estados_envio (estado) VALUES ('Pendiente'), ('Enviado'), ('Entregado');

-- Insertar datos de prueba en Inventarios con coherencia a los productos
INSERT INTO inventarios (producto_id, cantidad) VALUES
(1, 10), -- Laptop Gamer ASUS
(2, 5),  -- Tarjeta Gráfica RTX 4080
(3, 20), -- Teclado Mecánico RGB
(4, 15), -- Monitor 4K Samsung
(5, 25), -- Mouse Gaming Logitech
(6, 10), -- Auriculares Sony WH-1000XM4
(7, 30), -- SSD NVMe 1TB Samsung
(8, 8),  -- Laptop Dell XPS 15
(9, 12), -- Tarjeta Madre MSI Z690
(10, 7), -- Fuente de Poder EVGA 750W
(11, 20), -- RAM Corsair Vengeance 32GB
(12, 5),  -- Gabinete NZXT H510
(13, 12), -- Portátil HP Envy 13
(14, 17), -- Teclado Microsoft Surface
(15, 6),  -- Micrófono Blue Yeti
(16, 3),  -- Switch Cisco SG350
(17, 22), -- Cámara Web Logitech C920
(18, 4),  -- Tablet Samsung Galaxy Tab S8
(19, 10), -- Impresora Epson EcoTank
(20, 15), -- Disco Duro Externo 2TB
(21, 18), -- Altavoz Bluetooth JBL
(22, 8),  -- Procesador Intel Core i9
(23, 25), -- Adaptador WiFi USB TP-Link
(24, 12), -- Consola Xbox Series X
(25, 9);  -- Smartwatch Apple Watch Series 8

-- Actualizar inventario automaticamente (Recordatorio personal de descomentar para implementarlo automaticamente en el servidor)
--CREATE TRIGGER tr_actualizar_inventario
--ON detalles_pedido
--AFTER INSERT
--AS
--BEGIN
--    UPDATE i
--    SET i.cantidad = i.cantidad - d.cantidad,
--        i.ultima_actualizacion = GETDATE()
--    FROM inventarios i
--    JOIN inserted d ON i.producto_id = d.producto_id;
--END;
