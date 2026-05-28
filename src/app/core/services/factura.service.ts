import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private http = inject(HttpClient);

  listar(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${API_URL}/facturas`);
  }

  buscarPorId(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${API_URL}/facturas/${id}`);
  }

  guardar(factura: Omit<Factura, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Factura> {
    return this.http.post<Factura>(`${API_URL}/facturas`, factura);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/facturas/${id}`);
  }
}
