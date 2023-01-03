import { DetalleVenta } from "./detalle-venta";
export interface Venta {
  idVenta?: number,
  numeroDocumento?: string,
  fechaRegistro?: string,
  tipoPago?: string,
  totalNeto?: string,
  totalIVA?: string,
  total?: string,
  listDetalleVenta?:DetalleVenta[],
  id_local: number
}
