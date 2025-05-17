import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = 'https://techop-e-commerce.onrender.com/api/metodos-pago'; // URL del endpoint para obtener los métodos de pago

  constructor(private http: HttpClient) {}

  // Realiza una solicitud GET al backend y devuelve un observable con el resultado
  getMetodosPago(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(this.apiUrl);
  }
}
