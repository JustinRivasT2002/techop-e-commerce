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
  currentYear: number = new Date().getFullYear();
  productosCarrito: ProductoEnCarrito[] = [];
  mostrarResumen = false;
  intentoEnvio = false;
  mostrarPopupConfirmacionBoleano = false;

  // Datos del cliente
  emailUsuario = '';
  nombreUsuario = '';
  telefonoUsuario: number | null = null;
  direccionUsuario = '';
  metodoPagoId: number | null = null;
  metodosPago: { id: number; nombre: string }[] = [];

  constructor(private cartService: CartService, private metodoPagoService: MetodoPagoService, private orderService: OrderService) {}

  ngOnInit() {
    const carrito = this.cartService.obtenerCarrito();
    this.productosCarrito = Array.isArray(carrito) ? carrito : [];
    this.obtenerMetodosPago();
  }

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

  mostrarPopup() {
    this.mostrarResumen = true;
    this.intentoEnvio = false;
  }

  cerrarPopup() {
    this.mostrarResumen = false;
  }

  mostrarPopupConfirmacion() {
    if (!this.validarCampos()) {
      return;
    }
    this.mostrarPopupConfirmacionBoleano = true;
  }

  cerrarPopupConfirmacion() {
    this.mostrarPopupConfirmacionBoleano = false;
  }

  aumentar(id: number) {
    this.cartService.aumentarCantidad(id);
    this.actualizarCarrito();
  }

  reducir(id: number) {
    this.cartService.reducirCantidad(id);
    this.actualizarCarrito();
  }

  validarEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailUsuario);
  }

  validarTelefono(): boolean {
    return /^(?:\+34|0034|34)?[6789]\d{8}$/.test(this.telefonoUsuario?.toString() || '');
  }

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
        this.cartService.vaciarCarrito();
        this.cerrarPopup();
        this.cerrarPopupConfirmacion();
        this.limpiarDatosUsuario();
      },
      (error: any) => {
        console.error('❌ Error al realizar la compra:', error);
        alert('❌ Error al procesar la compra. Intenta nuevamente.');
      }
    );
  }

  finalizarCompra() {
    this.mostrarPopupConfirmacion();
  }

  get totalCarrito(): number {
    return this.productosCarrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  private actualizarCarrito() {
    const carritoActualizado = this.cartService.obtenerCarrito();
    this.productosCarrito = Array.isArray(carritoActualizado) ? carritoActualizado : [];
  }

  limpiarDatosUsuario() {
    this.productosCarrito = [];
    this.emailUsuario = '';
    this.nombreUsuario = '';
    this.telefonoUsuario = null;
    this.direccionUsuario = '';
    this.metodoPagoId = null;
  }
}
