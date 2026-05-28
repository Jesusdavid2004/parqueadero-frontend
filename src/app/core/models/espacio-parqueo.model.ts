import { EstadoEspacio, TipoVehiculo } from './enums-parqueadero.enum';

export interface EspacioParqueo {
  id: number;
  codigo: string;
  ubicacion: string;
  estado: EstadoEspacio;
  tipoVehiculoPermitido: TipoVehiculo;
  zonaId: number | null;
  zonaNombre: string | null;
}