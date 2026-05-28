export interface Cliente {
  id: number;
  identificacion: string;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  // Puedes agregar aquí campos como rol, estado, etc. si el backend los provee
}