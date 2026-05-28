import { BaseEntity } from './base.model';

export interface Factura extends BaseEntity {
  numeroFactura: string;
  subtotal: number;
  impuesto: number;
  total: number;
  pagoId: number;
}
