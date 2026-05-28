import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EspacioParqueo } from '../models/espacio-parqueo.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class EspacioParqueoService {
  private http = inject(HttpClient);

  listar(): Observable<EspacioParqueo[]> {
    return this.http.get<EspacioParqueo[]>(`${API_URL}/espacios`);
  }

  listarDisponibles(): Observable<EspacioParqueo[]> {
    return this.http.get<EspacioParqueo[]>(`${API_URL}/espacios/disponibles`);
  }

  buscarPorId(id: number): Observable<EspacioParqueo> {
    return this.http.get<EspacioParqueo>(`${API_URL}/espacios/${id}`);
  }

  guardar(espacio: Omit<EspacioParqueo, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo' | 'zonaNombre'>): Observable<EspacioParqueo> {
    return this.http.post<EspacioParqueo>(`${API_URL}/espacios`, espacio);
  }

  actualizar(id: number, espacio: Omit<EspacioParqueo, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo' | 'zonaNombre'>): Observable<EspacioParqueo> {
    return this.http.put<EspacioParqueo>(`${API_URL}/espacios/${id}`, espacio);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/espacios/${id}`);
  }
}
