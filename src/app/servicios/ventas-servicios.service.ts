import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Usuario } from '../interfaces/usuario';
import { Venta } from '../interfaces/venta';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class VentasServiciosService {
  apiBase: string = GlobalConstants.apiURL+'/api/Ventas/'
  // apiBase: string = '/api/Ventas/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
   }

  registrar(request: Venta): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Guardar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })
 
  }

  historal(buscarPor:string,numeroVenta:string,fechaInicio:string,fechaFin:string): Observable<ResponseApi> {
    
    return this.http.get<ResponseApi>(`${this.apiBase}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&id_local=${this.UsuarioLogueado.idLocal}`);

  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);

  }
}
