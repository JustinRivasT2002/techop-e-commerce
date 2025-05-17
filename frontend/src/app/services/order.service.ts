import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoEnCarrito } from '../interfaces/productoEnCarrito';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://techop-e-commerce.onrender.com/api/create-order'; // URL del endpoint para crear pedidos

  constructor(private http: HttpClient) {}

  realizarCompra(email: string, nombre: string, telefono: Number, direccion: string, metodoPagoId: number): Observable<any> {
    const pedidoData = {
      email: email, // Email del cliente
      nombre: nombre, // Nombre del cliente
      telefono: Number(telefono), // Teléfono del cliente
      direccion: direccion, // Dirección de envío
      total: this.calcularTotal(), // Total del pedido
      metodo_pago_id: Number(metodoPagoId), // ID del método de pago seleccionado
      estado_envio_id: 1, // Estado de envío inicial (por defecto Pendiente)
      detalles: this.obtenerDetalles() // Lista de productos del carrito
    };

    console.log('🛒 Enviando pedido al backend:', pedidoData);

    return this.http.post<any>(this.apiUrl, pedidoData);
  }

  // Obtener detalles del pedido desde localstorage
  private obtenerDetalles(): ProductoEnCarrito[] {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.map((producto: ProductoEnCarrito) => ({
      producto_id: producto.id,
      cantidad: producto.cantidad,
      precio_unitario: producto.precio
    }));
  }

  // Calcula el total del pedido
  private calcularTotal(): number {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.reduce((total: number, producto: ProductoEnCarrito) => total + (producto.precio * producto.cantidad), 0);
  }
}
