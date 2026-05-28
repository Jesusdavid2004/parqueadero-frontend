import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Reserva } from '../models/reserva.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private http = inject(HttpClient);

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${API_URL}/reservas`);
  }

  buscarPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${API_URL}/reservas/${id}`);
  }

  guardar(reserva: Omit<Reserva, 'id'>): Observable<Reserva> {
    return this.http.post<Reserva>(`${API_URL}/reservas`, reserva);
  }

  actualizar(id: number, reserva: Omit<Reserva, 'id'>): Observable<Reserva> {
    return this.http.put<Reserva>(`${API_URL}/reservas/${id}`, reserva);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/reservas/${id}`);
  }
}