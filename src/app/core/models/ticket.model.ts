import { BaseEntity } from './base.model';
import { EstadoTicket } from './enums-parqueadero.enum';

export interface Ticket extends BaseEntity {
  codigoTicket: string;
  horaEntrada: string;
  horaSalida: string | null;
  estado: EstadoTicket;
  total: number;
  vehiculoId: number;
  espacioId: number;
}
