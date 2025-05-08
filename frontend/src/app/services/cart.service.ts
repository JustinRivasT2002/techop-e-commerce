import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto.interfaces';
import { ProductoEnCarrito } from '../interfaces/productoEnCarrito';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito: ProductoEnCarrito[] = [];

  agregarAlCarrito(producto: Producto) {
    const existente = this.carrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  }

  obtenerCarrito(): ProductoEnCarrito[] {
    return this.carrito;
  }

  aumentarCantidad(id: number) {
    const producto = this.carrito.find(p => p.id === id);
    if (producto) {
      producto.cantidad++;
    }
  }

  reducirCantidad(id: number) {
    const index = this.carrito.findIndex(p => p.id === id);
    if (index !== -1) {
      this.carrito[index].cantidad--;
      if (this.carrito[index].cantidad === 0) {
        this.carrito.splice(index, 1);
      }
    }
  }

  vaciarCarrito() {
    this.carrito = [];
  }
}
