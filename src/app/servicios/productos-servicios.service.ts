import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Producto } from '../interfaces/producto';
import { Usuario } from '../interfaces/usuario';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})


export class ProductosServiciosService {
  apiBase: string =  GlobalConstants.apiURL+'/api/Productos/'
  // apiBase: string = '/api/Productos/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
  }

  getProductos(): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetProductos?id_local=${this.UsuarioLogueado.idLocal}`)

  }

  save(request: Producto): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Guardar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  edit(request: Producto): Observable<ResponseApi> {
    
    return this.http.put<ResponseApi>(`${this.apiBase}Editar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  delete(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.apiBase}Eliminar/${id}`);

  }

  getPrecioCompra(idproducto: number,idproveedor: number): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetPrecioProductosProveedorCompra?idlocal=${this.UsuarioLogueado.idLocal}&idproducto=${idproducto}&proveedor=${idproveedor}`);

  }

  getExisteProductoProveedor(idproducto: number,idproveedor: number): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetvalidaproductoProveedor?idproducto=${idproducto}&proveedor=${idproveedor}`);

  }

  getPrecioProveedores(idproducto: number): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetPrecioProveedor?idproducto=${idproducto}`);

  }
}
