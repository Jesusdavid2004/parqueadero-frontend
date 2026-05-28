import { EstadoTicket } from './enums-parqueadero.enum';

export interface Ticket {
  id: number;
  codigoTicket: string;
  horaEntrada: string;
  horaSalida: string | null;
  estado: EstadoTicket;
  total: number;
  vehiculoId: number;
  espacioId: number;
}