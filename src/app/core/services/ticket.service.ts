import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { API_URL } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);

  listar(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_URL}/tickets`);
  }

  buscarPorId(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${API_URL}/tickets/${id}`);
  }

  guardar(ticket: Omit<Ticket, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Ticket> {
    return this.http.post<Ticket>(`${API_URL}/tickets`, ticket);
  }

  actualizar(id: number, ticket: Omit<Ticket, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'>): Observable<Ticket> {
    return this.http.put<Ticket>(`${API_URL}/tickets/${id}`, ticket);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tickets/${id}`);
  }
}
