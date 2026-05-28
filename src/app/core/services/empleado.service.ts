import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);

  listar(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${API_URL}/empleados`);
  }

  buscarPorId(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${API_URL}/empleados/${id}`);
  }

  guardar(empleado: Omit<Empleado, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Empleado> {
    return this.http.post<Empleado>(`${API_URL}/empleados`, empleado);
  }

  actualizar(id: number, empleado: Omit<Empleado, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Empleado> {
    return this.http.put<Empleado>(`${API_URL}/empleados/${id}`, empleado);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/empleados/${id}`);
  }
}
