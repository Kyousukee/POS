import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Proveedor } from '../interfaces/proveedor';
import { Usuario } from '../interfaces/usuario';
import { Proveedorproducto } from '../interfaces/proveedorproducto';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ProveedorServiciosService {
  // apiBase: string = '/api/Proveedor/'
  apiBase: string = GlobalConstants.apiURL+'/api/Proveedor/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) { 
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
  }

  getProveedores(): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetProveedores?id_local=${this.UsuarioLogueado.idLocal}`)

  }

  save(request: Proveedor): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Guardar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  edit(request: Proveedor): Observable<ResponseApi> {
    
    return this.http.put<ResponseApi>(`${this.apiBase}Editar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  delete(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.apiBase}Eliminar/${id}`);

  }

  getProveedoresProductos(id: number): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetProveedoresProductosList?idProveedor=${id}`)

  }

  GetPrecioHistorial(idpropre: number): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}GetPrecioHistorial?idpropre=${idpropre}`)

  }

  deleteproducto(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.apiBase}EliminarProducto/${id}`);

  }

  saveProducto(request: Proveedorproducto): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}GuardarProducto`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  editProducto(request: Proveedorproducto): Observable<ResponseApi> {
    
    return this.http.put<ResponseApi>(`${this.apiBase}EditarProducto`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }
}
