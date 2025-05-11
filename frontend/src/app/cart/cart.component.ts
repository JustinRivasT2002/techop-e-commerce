import { ProductoEnCarrito } from './../interfaces/productoEnCarrito';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { MetodoPagoService } from '../services/metodoPago.service';

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

  // Datos del cliente
  emailUsuario = '';
  nombreUsuario = '';
  telefonoUsuario = '';
  direccionUsuario = '';
  metodoPagoId: number | null = null;
  metodosPago: { id: number; nombre: string }[] = [];

  constructor(private cartService: CartService, private metodoPagoService: MetodoPagoService) {}

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
      (error) => {
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
    return /^(?:\+34|0034|34)?[6789]\d{8}$/.test(this.telefonoUsuario);
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

  finalizarCompra() {
  if (!this.validarCampos()) {
    return;
  }

  alert(`✅ Compra lista para procesar. Total: ${this.totalCarrito.toFixed(2)} €`);

  this.cartService.vaciarCarrito();
  this.cerrarPopup();
  this.limpiarDatosUsuario();
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
    this.telefonoUsuario = '';
    this.direccionUsuario = '';
    this.metodoPagoId = null;
  }
}
