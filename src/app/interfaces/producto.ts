export interface Producto {
  idProducto: number,
  nombre: string,
  // idCategoria: number,
  descripcionCategoria: string, 
  id_cob: number,
  CobDescripcion: string,
  stock:number,
  precio:string,
  precioCompra:string,
  codBarras:string,
  esActivo: boolean,
  precioProveedor:boolean,
  precioProporcional:boolean,
  id_local: number,
  porcentaje:string,
  usuario:string
}
