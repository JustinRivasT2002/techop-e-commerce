import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoEnCarrito } from '../interfaces/productoEnCarrito';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/create-order';

  constructor(private http: HttpClient) {}

  realizarCompra(email: string, metodoPagoId: number): Observable<any> {
    const pedidoData = {
      email: email,
      total: this.calcularTotal(),
      metodo_pago_id: metodoPagoId,
      estado_envio_id: 1,
      detalles: this.obtenerDetalles()
    };

    return this.http.post<any>(this.apiUrl, pedidoData);
  }

  private obtenerDetalles(): ProductoEnCarrito[] {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.map((producto: ProductoEnCarrito) => ({
      producto_id: producto.id,
      cantidad: producto.cantidad,
      precio_unitario: producto.precio
    }));
  }

  private calcularTotal(): number {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.reduce((total: number, producto: ProductoEnCarrito) => total + (producto.precio * producto.cantidad), 0);
  }
}
