import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api-base';

export type RolUsuario = 'ADMIN' | 'CLIENTE';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  rol: RolUsuario;
  clienteId: number | null;
  mensaje: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol?: RolUsuario;
  clienteId?: number | null;
}

interface SessionData {
  user: AuthResponse;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'auth_session';

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${data.username}:${data.password}`)
    });

    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, data, { headers }).pipe(
      tap(user => this.setSession(user, data.username, data.password))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data);
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${API_URL}/auth/me`);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getSession();
  }

  getCurrentUser(): AuthResponse | null {
    return this.getSession()?.user ?? null;
  }

  getUserRole(): RolUsuario | null {
    return this.getCurrentUser()?.rol ?? null;
  }

  getBasicToken(): string | null {
    const session = this.getSession();
    if (!session) return null;
    return 'Basic ' + btoa(`${session.username}:${session.password}`);
  }

  private setSession(user: AuthResponse, username: string, password: string): void {
    if (!this.isBrowser) return;
    const session: SessionData = { user, username, password };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
  }

  private getSession(): SessionData | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionData) : null;
  }
}