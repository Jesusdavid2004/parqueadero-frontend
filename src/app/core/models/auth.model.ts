export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol?: 'ADMIN' | 'CLIENTE';
  clienteId?: number | null;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
  clienteId: number | null;
  mensaje: string;
}