import { BaseEntity } from './base.model';
import { TipoZona } from './enums-parqueadero.enum';

export interface Zona extends BaseEntity {
  nombre: string;
  descripcion: string;
  tipoZona: TipoZona;
  sedeId: number;
  sedeNombre: string | null;
}
