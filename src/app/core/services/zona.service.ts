import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zona } from '../models/zona.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private http = inject(HttpClient);

  listar(): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${API_URL}/zonas`);
  }

  buscarPorId(id: number): Observable<Zona> {
    return this.http.get<Zona>(`${API_URL}/zonas/${id}`);
  }

  guardar(zona: Omit<Zona, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo' | 'sedeNombre'>): Observable<Zona> {
    return this.http.post<Zona>(`${API_URL}/zonas`, zona);
  }

  actualizar(id: number, zona: Omit<Zona, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo' | 'sedeNombre'>): Observable<Zona> {
    return this.http.put<Zona>(`${API_URL}/zonas/${id}`, zona);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/zonas/${id}`);
  }
}
