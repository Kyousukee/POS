import { responseHistorialDetalle } from './responseHistorialDetalle';
export interface responseHistorial {
    identificador?: number,
    numeroDocumento?: string,
    fechaRegistro?: string,
    tipoPago?: string,
    totalNeto?: string,
    totalIVA?: string,
    total?: string,
    listDetalle?:responseHistorialDetalle[],
    conProveedor:boolean,
    desc_proveedor:string
  }