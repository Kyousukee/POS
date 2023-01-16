import { DetalleCompra } from './detalle-compra';
export interface Compra{
    idCompra?: number,
    numeroDocumento?: string,
    fechaRegistro?: string,
    tipoPago?: string,
    totalNeto?: string,
    totalIVA?: string,
    total?: string,
    ListDetalleCompra?:DetalleCompra[],
    id_local: number,
    conProveedor: boolean,
    IdProveedor: number,
    usuario:string
}