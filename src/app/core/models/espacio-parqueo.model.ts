import { BaseEntity } from './base.model';
import { EstadoEspacio, TipoVehiculo } from './enums-parqueadero.enum';

export interface EspacioParqueo extends BaseEntity {
  codigo: string;
  ubicacion: string;
  estado: EstadoEspacio;
  tipoVehiculoPermitido: TipoVehiculo;
  zonaId: number | null;
  zonaNombre: string | null;
}
