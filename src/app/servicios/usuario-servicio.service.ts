import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { ResponseApi } from '../interfaces/response-api';
import{ GlobalConstants } from '../components/reusable/global-constants';


@Injectable({
  providedIn: 'root'
})
export class UsuarioServicioService {
  // apiBase: string = '/api/Usuarios/'
  apiBase: string = GlobalConstants.apiURL+'/api/Usuarios/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
  }

  getIniciarSesion(correo: string, clave: string): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}IniciarSesion?correo=${correo}&clave=${clave}`)
  }

  getUsuarios(): Observable<ResponseApi> {

    return this.http.get <ResponseApi>(`${this.apiBase}GetUsuarios?id_local=${this.UsuarioLogueado.idLocal}`)

  }

  saveUsuario(request:Usuario): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Guardar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' }})

  }

  editUsuario(request: Usuario): Observable<ResponseApi> {

    return this.http.put<ResponseApi>(`${this.apiBase}Editar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

deleteUsuario(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.apiBase}Eliminar/${id}`);

  }
}
