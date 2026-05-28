import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../models/sede.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private http = inject(HttpClient);

  listar(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${API_URL}/sedes`);
  }

  buscarPorId(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${API_URL}/sedes/${id}`);
  }

  guardar(sede: Omit<Sede, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Sede> {
    return this.http.post<Sede>(`${API_URL}/sedes`, sede);
  }

  actualizar(id: number, sede: Omit<Sede, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Sede> {
    return this.http.put<Sede>(`${API_URL}/sedes/${id}`, sede);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/sedes/${id}`);
  }
}
