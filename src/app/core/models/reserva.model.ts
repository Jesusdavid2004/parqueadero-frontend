import { BaseEntity } from './base.model';
import { EstadoReserva } from './enums-parqueadero.enum';

export interface Reserva extends BaseEntity {
  codigoReserva: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoReserva;
  clienteId: number;
  vehiculoId: number;
  espacioId: number;
}
