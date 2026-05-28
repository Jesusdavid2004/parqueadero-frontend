import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarifa } from '../models/tarifa.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private http = inject(HttpClient);

  listar(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(`${API_URL}/tarifas`);
  }

  buscarPorId(id: number): Observable<Tarifa> {
    return this.http.get<Tarifa>(`${API_URL}/tarifas/${id}`);
  }

  guardar(tarifa: Omit<Tarifa, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Tarifa> {
    return this.http.post<Tarifa>(`${API_URL}/tarifas`, tarifa);
  }

  actualizar(id: number, tarifa: Omit<Tarifa, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Tarifa> {
    return this.http.put<Tarifa>(`${API_URL}/tarifas/${id}`, tarifa);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tarifas/${id}`);
  }
}
