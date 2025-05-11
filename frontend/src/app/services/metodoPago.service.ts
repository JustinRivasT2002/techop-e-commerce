import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = 'http://localhost:3000/metodos-pago';

  constructor(private http: HttpClient) {}

  getMetodosPago(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<{ id: number; nombre: string }[]>(this.apiUrl);
  }
}
