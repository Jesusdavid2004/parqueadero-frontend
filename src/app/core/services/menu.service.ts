import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from './api-base';
import { MenuItem } from '../models/menu.model';

export interface MenuRequest {
  nombre: string;
  ruta: string;
  activo: boolean;
  padreId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);

  listarTodos(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${API_URL}/menus`);
  }

  listarArbol(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${API_URL}/menus/arbol`);
  }

  buscarPorId(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${API_URL}/menus/${id}`);
  }

  guardar(menu: MenuRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${API_URL}/menus`, menu);
  }

  actualizar(id: number, menu: MenuRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${API_URL}/menus/${id}`, menu);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${API_URL}/menus/${id}`, {
      responseType: 'text'
    });
  }
}