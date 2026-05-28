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

  listarDisponibles(): Observable<EspacioParqueo[]> {
    return this.http.get<EspacioParqueo[]>(`${API_URL}/espacios/disponibles`);
  }
}