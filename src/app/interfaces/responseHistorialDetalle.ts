export interface responseHistorialDetalle {
    orden:number,
    idProducto: number,
    descripcionProducto: string,
    descripcionCobro:string,
    cantidad: number,
    precioTexto: string,
    totalNeto?: string,
    totalIVA?: string,
    totalTexto:string
  }
  