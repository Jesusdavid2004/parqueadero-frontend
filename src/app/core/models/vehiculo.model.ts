import { BaseEntity } from './base.model';
import { TipoVehiculo } from './enums-parqueadero.enum';

export interface Vehiculo extends BaseEntity {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: TipoVehiculo;
  clienteId: number;
}
