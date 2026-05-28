import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from './api-base';
import { Vehiculo } from '../models/vehiculo.model';
import { Ticket } from '../models/ticket.model';
import { ClienteDashboardResponse } from '../models/cliente-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteZonaService {
  private http = inject(HttpClient);

  dashboard(): Observable<ClienteDashboardResponse> {
    return this.http.get<ClienteDashboardResponse>(`${API_URL}/cliente/dashboard`);
  }

  misVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${API_URL}/cliente/vehiculos`);
  }

  misTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_URL}/cliente/tickets`);
  }
}