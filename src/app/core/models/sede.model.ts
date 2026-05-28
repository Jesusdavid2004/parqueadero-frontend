import { BaseEntity } from './base.model';

export interface Sede extends BaseEntity {
  nombre: string;
  direccion: string;
  ciudad: string;
}
