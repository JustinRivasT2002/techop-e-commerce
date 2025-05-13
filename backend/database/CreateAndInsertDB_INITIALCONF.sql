-- Crear tabla de Clientes
CREATE TABLE clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono INT,
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
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen) VALUES
('Laptop Gamer ASUS', 'Potente laptop para gaming', 1500.00, 1, 'https://dlcdnwebimgs.asus.com/gain/1d7ff1ce-d5ed-4184-bbfa-2cee7150b1fc/w800'),
('Tarjeta Gráfica RTX 4080', 'Gráfica de última generación', 1200.00, 2, 'https://img.pccomponentes.com/articles/1063/10639307/1957-msi-geforce-rtx-4080-ventus-3x-oc-16gb-gddr6x-mejor-precio.jpg'),
('Teclado Mecánico RGB', 'Teclado mecánico retroiluminado', 100.00, 3, 'https://img.pccomponentes.com/articles/1042/10427803/1673-sharkoon-skiller-sgk60-teclado-mecanico-rgb-switch-brown.jpg'),
('Monitor 4K Samsung', 'Monitor UHD de alta calidad', 300.00, 3, 'https://www.coolmod.com/images/product/large/samsung-u28r550uqu-28-uhd-4k-freesync-monitor-001.jpg'),
('Mouse Gaming Logitech', 'Mouse ergonómico para gamers', 50.00, 3, 'https://img.pccomponentes.com/articles/28/287353/logitech-g203-lightsync-2nd-gen-raton-gaming-8000dpi-rgb-negro.jpg'),
('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido', 350.00, 3, 'https://img.pccomponentes.com/articles/1028/10285184/1650-sony-wh-1000xm4-auriculares-bluetooth-plata.jpg'),
('SSD NVMe 1TB Samsung', 'Unidad de almacenamiento ultrarrápida', 200.00, 2, 'https://qloudea.com/39727-large_default/samsung-mz-v8v1t0bw.jpg'),
('Laptop Dell XPS 15', 'Laptop premium para trabajo y entretenimiento', 1800.00, 1, 'https://img.pccomponentes.com/articles/1029/10294662/1565-dell-xps-15-9520-intel-core-i7-12700h-16gb-1tb-ssd-rtx3050-ti-156.jpg'),
('Tarjeta Madre MSI Z690', 'Placa base de alto rendimiento', 250.00, 2, 'https://img.pccomponentes.com/articles/67/673217/1743-msi-pro-z690-a-wifi-ddr4.jpg'),
('Fuente de Poder EVGA 750W', 'Fuente de poder modular', 120.00, 2, 'https://img.pccomponentes.com/articles/31/310518/1828-evga-750-b5-750w-80-plus-bronze-full-modular.jpg'),
('RAM Corsair Vengeance 32GB', 'Memoria RAM DDR4 de alta velocidad', 150.00, 2, 'https://img.pccomponentes.com/articles/35/351295/1838-corsair-vengeance-rgb-pro-ddr4-3200-pc4-25600-32gb-2x16gb-cl16.jpg'),
('Gabinete NZXT H510', 'Gabinete para PC con diseño moderno', 100.00, 2, 'https://www.coolmod.com/images/product/large/nzxt-h510-elite-cristal-templado-blanco-caja-torre-001.jpg'),
('Portátil HP Envy 13', 'Portátil compacto y ligero', 1100.00, 1, 'https://img.pccomponentes.com/articles/16/166555/5.jpg'),
('Teclado Microsoft Surface', 'Teclado elegante y ligero', 150.00, 3, 'https://img.pccomponentes.com/articles/1084/10844182/1310-microsoft-teclado-para-surface-pro-espanol-qwerty-negro.jpg'),
('Micrófono Blue Yeti', 'Micrófono USB profesional', 130.00, 3, 'https://img.pccomponentes.com/articles/32/327983/1303-blue-microphones-yeti-microfono-usb-negro-para-grabacion-y-transmision-en-pc-ff09943e-ed13-4890-a4a4-fbe3750fbef9.jpg'),
('Switch Cisco SG350', 'Switch gestionable de 24 puertos', 600.00, 2, 'https://img.pccomponentes.com/articles/40/401810/174-cisco-sg350-28p-switch-28-puertos-2-sfp.jpg'),
('Cámara Web Logitech C920', 'Cámara HD para videoconferencias', 90.00, 3, 'https://img.pccomponentes.com/articles/27/278320/1475-logitech-streamcam-webcam-usb-c-full-hd-negra-comprar.jpg'),
('Tablet Samsung Galaxy Tab S8', 'Tablet potente para entretenimiento', 700.00, 1, 'https://img.pccomponentes.com/articles/1051/10519758/1941-samsung-galaxy-tab-s8-ultra-5g-12-256-gb-gris.jpg'),
('Impresora Epson EcoTank', 'Impresora con bajo consumo de tinta', 250.00, 3, 'https://img.pccomponentes.com/articles/1080/10803497/1246-epson-ecotank-et-2840-impresora-multifuncion-color-wifi-negra.jpg'),
('Disco Duro Externo 2TB', 'Almacenamiento portátil', 120.00, 3, 'https://www.powerplanetonline.com/cdnassets/disco_duro_externo_2tb_western_digital_elements_2_5_usb_3_2_gen_1_01_l.jpg'),
-- Continúa con los 30 productos restantes, asegurándote de variar las descripciones y categorías
('Altavoz Bluetooth JBL', 'Altavoz portátil con excelente sonido', 150.00, 3, 'https://visanta.com/67769-large_default/altavoz-bluetooth-jbl-flip-6-rojo.jpg'),
('Procesador Intel Core i9', 'Procesador de alto rendimiento', 500.00, 2, 'https://cdn2.depau.es/articulos/800/800/fixed/art_itl-i9%2014900%202%2000ghz_1.jpg'),
('Adaptador WiFi USB TP-Link', 'Conexión WiFi rápida y estable', 30.00, 3, 'https://sonicolor.es/57320-large_default/tp-link-tl-wn823n-adaptador-usb-wifi.jpg'),
('Consola Xbox Series X', 'Consola de videojuegos de última generación', 500.00, 3, 'https://img.pccomponentes.com/articles/32/323078/1684-microsoft-xbox-series-x-1tb.jpg'),
('Smartwatch Apple Watch Series 8', 'Reloj inteligente con múltiples funciones', 400.00, 3, 'https://img.pccomponentes.com/articles/1058/10581508/1936-apple-watch-series-8-gps-cellular-45mm-caja-de-aluminio-con-correa-deportiva-productred.jpg');

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
