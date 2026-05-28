import { BaseEntity } from './base.model';

export interface Empleado extends BaseEntity {
  identificacion: string;
  nombre: string;
  telefono: string;
  correo: string;
  codigoEmpleado: string;
  cargo: string;
}
