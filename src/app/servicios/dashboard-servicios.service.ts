import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Reporte } from '../interfaces/reporte';
import { Usuario } from '../interfaces/usuario';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiciosService {
  apiBase: string = GlobalConstants.apiURL+'/api/Dashboard/'
  // apiBase: string = '/api/Dashboard/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
   }

  resumen(): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Resumen?id_local=${this.UsuarioLogueado.idLocal}`);

  }
}
