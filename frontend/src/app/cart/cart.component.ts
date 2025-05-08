import { ProductoEnCarrito } from './../interfaces/productoEnCarrito';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
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

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const carrito = this.cartService.obtenerCarrito();
    this.productosCarrito = Array.isArray(carrito) ? carrito : [];
  }

  aumentar(id: number) {
    this.cartService.aumentarCantidad(id);
    this.actualizarCarrito();
  }

  reducir(id: number) {
    this.cartService.reducirCantidad(id);
    this.actualizarCarrito();
  }

  finalizarCompra() {
    alert(`Compra finalizada con éxito. Total: ${this.totalCarrito.toFixed(2)} €`);
    this.cartService.vaciarCarrito();
    this.productosCarrito = [];
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
}
