import { EstadoReserva } from './enums-parqueadero.enum';

export interface Reserva {
  id: number;
  codigoReserva: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  estado: EstadoReserva;
  clienteId: number;
  vehiculoId: number;
  espacioId: number;
}