import { ProductoEnCarrito } from './../interfaces/productoEnCarrito';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { MetodoPagoService } from '../services/metodoPago.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  currentYear: number = new Date().getFullYear(); // Año actual para el footer
  productosCarrito: ProductoEnCarrito[] = [];  // Productos que se encuentran actualmente en el carrito

  // Control de visibilidad de formularios/popup
  mostrarResumen = false;
  intentoEnvio = false;
  mostrarPopupConfirmacionBoleano = false;

  // Datos del cliente
  emailUsuario = '';
  nombreUsuario = '';
  telefonoUsuario: number | null = null;
  direccionUsuario = '';
  metodoPagoId: number | null = null;
  metodosPago: { id: number; nombre: string }[] = []; // Lista de métodos de pago disponibles obtenidos desde el backend

  constructor(private cartService: CartService, private metodoPagoService: MetodoPagoService, private orderService: OrderService) {} // Inyección de servicios necesarios

  // Al inicializar el componente, se carga el carrito y los métodos de pago
  ngOnInit() {
    const carrito = this.cartService.obtenerCarrito();
    this.productosCarrito = Array.isArray(carrito) ? carrito : [];
    this.obtenerMetodosPago();
  }

  // Obtiene los métodos de pago disponibles desde el backend
  obtenerMetodosPago() {
    this.metodoPagoService.getMetodosPago().subscribe(
      (metodos) => {
        this.metodosPago = metodos;
      },
      (error: any) => {
        console.error('❌ Error al obtener métodos de pago:', error);
      }
    );
  }

  // Muestra el popup con el formulario de datos del cliente
  mostrarPopup() {
    this.mostrarResumen = true;
    this.intentoEnvio = false;
  }

  // Cierra el popup del formulario
  cerrarPopup() {
    this.mostrarResumen = false;
  }

  // Si los campos son válidos, se muestra el resumen final de la compra
  mostrarPopupConfirmacion() {
    if (!this.validarCampos()) {
      return;
    }
    this.mostrarPopupConfirmacionBoleano = true;
  }

  // Cierra el popup del resumen final de la compra
  cerrarPopupConfirmacion() {
    this.mostrarPopupConfirmacionBoleano = false;
  }

  // Aumenta la cantidad de un producto en el carrito
  aumentar(id: number) {
    this.cartService.aumentarCantidad(id);
    this.actualizarCarrito();
  }

  // Reduce la cantidad de un producto en el carrito
  reducir(id: number) {
    this.cartService.reducirCantidad(id);
    this.actualizarCarrito();
  }

  // Valida que el email tenga un formato correcto
  validarEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailUsuario);
  }

  // Valida que el número de teléfono sea válido en formato español
  validarTelefono(): boolean {
    return /^(?:\+34|0034|34)?[6789]\d{8}$/.test(this.telefonoUsuario?.toString() || '');
  }

  // Devuelve el nombre del método de pago seleccionado
  getNombreMetodoPago(): string {
  if (this.metodoPagoId === null) {
    return 'No seleccionado';
  }

  for (const metodo of this.metodosPago) {
    if (metodo.id == this.metodoPagoId) {
      return metodo.nombre;
    }
  }

  return 'No seleccionado';
}

  // Verifica que todos los campos del formulario estén completos y sean válidos
  validarCampos(): boolean {
    this.intentoEnvio = true;

    if (!this.emailUsuario || !this.nombreUsuario || !this.telefonoUsuario || !this.direccionUsuario || !this.metodoPagoId) {
      return false;
    }

    if (!this.validarEmail()) {
      return false;
    }

    if (!this.validarTelefono()) {
      return false;
    }

    return true;
  }

  // Envía la solicitud de compra al backend
  confirmarCompra() {
    this.orderService.realizarCompra(
      this.emailUsuario,
      this.nombreUsuario,
      this.telefonoUsuario!,
      this.direccionUsuario,
      this.metodoPagoId!
    ).subscribe(
      (response: any) => {
        console.log('✅ Pedido realizado con éxito:', response);
        alert(`✅ Compra realizada con éxito. Te enviaremos un correo con los detalles de tu pedido.`);
        this.cartService.vaciarCarrito(); // Vacía el carrito tras confirmar
        this.cerrarPopup(); // Cierra formularios
        this.cerrarPopupConfirmacion(); // Cierra popup confirmación de finalización de comrpra
        this.limpiarDatosUsuario(); // Limpia los datos del cliente
      },
      (error: any) => {
        console.error('❌ Error al realizar la compra:', error);
        alert('❌ Error al procesar la compra. Intenta nuevamente.');
      }
    );
  }

  // Lógica al pulsar "Finalizar compra"
  finalizarCompra() {
    this.mostrarPopupConfirmacion();
  }

  // Calcula el total del carrito sumando el precio por cantidad de cada producto
  get totalCarrito(): number {
    return this.productosCarrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  // Actualiza la lista de productos del carrito con el estado más reciente
  private actualizarCarrito() {
    const carritoActualizado = this.cartService.obtenerCarrito();
    this.productosCarrito = Array.isArray(carritoActualizado) ? carritoActualizado : [];
  }

  // Limpia los datos introducidos por el cliente (al finalizar compra o cancelar)
  limpiarDatosUsuario() {
    this.productosCarrito = [];
    this.emailUsuario = '';
    this.nombreUsuario = '';
    this.telefonoUsuario = null;
    this.direccionUsuario = '';
    this.metodoPagoId = null;
  }
}
