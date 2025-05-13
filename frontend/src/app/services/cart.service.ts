import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto.interfaces';
import { ProductoEnCarrito } from '../interfaces/productoEnCarrito';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito: ProductoEnCarrito[] = []; // Arreglo que representa los productos añadidos al carrito

  constructor() {
    this.cargarCarritoDesdeLocalStorage(); // Carga el carrito desde localStorage al inicializar el servicio
  }

  // Método privado que carga el carrito desde localStorage
  private cargarCarritoDesdeLocalStorage() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]'); // Intenta obtener los datos guardados en localStorage
  }

  // Método para agregar un producto al carrito (control del aumento o disminución desde el carrito recibido de detail products)
  agregarAlCarrito(producto: Producto) {
    const existente = this.carrito.find(p => p.id === producto.id);
    if (existente) {
      existente.cantidad++; // Si ya existe, incrementa la cantidad
    } else {
      this.carrito.push({ ...producto, cantidad: 1 }); // Si no existe, lo agrega con cantidad 1
    }
    this.guardarCarrito();
  }

  // Método para obtener el carrito
  obtenerCarrito(): ProductoEnCarrito[] {
    return this.carrito;
  }

  // Aumentar o disminuir la cantidad desde la interfaz del carrito
  aumentarCantidad(id: number) {
    const producto = this.carrito.find(p => p.id === id);
    if (producto) {
      producto.cantidad++;
    }
    this.guardarCarrito();
  }

  // Disminuir la cantidad desde la interfaz del carrito
  reducirCantidad(id: number) {
    const index = this.carrito.findIndex(p => p.id === id);
    if (index !== -1) {
      this.carrito[index].cantidad--;
      // Si la cantidad llega a 0, elimina el producto del carrito
      if (this.carrito[index].cantidad === 0) {
        this.carrito.splice(index, 1);
      }
    }
    this.guardarCarrito();
  }

  // Método para vaciar el carrito
  vaciarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  }

  // Método para guardar los cambios en el carrito en localStorage
  private guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
