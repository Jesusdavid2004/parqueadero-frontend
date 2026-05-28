export type RolUsuario = 'ADMIN' | 'CLIENTE';

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

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  rol: RolUsuario;
  clienteId: number | null;
  mensaje: string;
}