export interface Factura {
  id: number;
  numeroFactura: string;
  subtotal: number;
  impuesto: number;
  total: number;
  pagoId: number;
  // Puedes agregar aquí campos como fecha, estado, clienteId, etc. si el backend los provee
}