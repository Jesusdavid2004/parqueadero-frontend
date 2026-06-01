export interface BaseEntity {
  id: number;
  fechaCreacion?: string | null;
  fechaActualizacion?: string | null;
  activo?: boolean;
}
