export interface MenuItem {
  id: number;
  nombre: string;
  ruta: string;
  activo: boolean;
  padreId: number | null;
  hijos: MenuItem[];
  // Puedes agregar aquí campos como icono, orden, etc. si el backend los provee
}