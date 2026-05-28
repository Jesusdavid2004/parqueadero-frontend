import { BaseEntity } from './base.model';
import { MetodoPago, EstadoPago } from './enums-parqueadero.enum';

export interface Pago extends BaseEntity {
  monto: number;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  referencia: string;
  fecha: string;
  ticketId: number;
}
