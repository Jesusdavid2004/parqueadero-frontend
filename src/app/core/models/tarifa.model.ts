import { BaseEntity } from './base.model';
import { TipoVehiculo } from './enums-parqueadero.enum';

export interface Tarifa extends BaseEntity {
  tipoVehiculo: TipoVehiculo;
  valorHora: number;
  valorDia: number;
  valorFraccion: number;
}
