import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../models/pago.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private http = inject(HttpClient);

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${API_URL}/pagos`);
  }

  buscarPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${API_URL}/pagos/${id}`);
  }

  guardar(pago: Omit<Pago, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Pago> {
    return this.http.post<Pago>(`${API_URL}/pagos`, pago);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/pagos/${id}`);
  }
}
