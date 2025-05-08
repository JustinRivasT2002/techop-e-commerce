import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/comprar';

  constructor(private http: HttpClient) {}

  realizarCompra(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }
}
