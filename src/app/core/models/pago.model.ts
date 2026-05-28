import { MetodoPago, EstadoPago } from './enums-parqueadero.enum';

export interface Pago {
  id: number;
  monto: number;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  referencia: string;
  fecha: string;
  ticketId: number;
}