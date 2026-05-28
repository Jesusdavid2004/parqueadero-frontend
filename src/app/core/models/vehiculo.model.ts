import { TipoVehiculo } from './enums-parqueadero.enum';

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: TipoVehiculo;
  clienteId: number;
}