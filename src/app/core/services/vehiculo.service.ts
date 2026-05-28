import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vehiculo } from '../models/vehiculo.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private http = inject(HttpClient);

  listar(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API_URL}/vehiculos`);
  }

  buscarPorId(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${API_URL}/vehiculos/${id}`);
  }

  guardar(vehiculo: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(`${API_URL}/vehiculos`, vehiculo);
  }

  actualizar(id: number, vehiculo: Omit<Vehiculo, 'id'>): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${API_URL}/vehiculos/${id}`, vehiculo);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/vehiculos/${id}`);
  }
}