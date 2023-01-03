import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Usuario } from '../interfaces/usuario';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ReportesServiciosService {
  // apiBase: string = '/api/Reportes/'
  apiBase: string = GlobalConstants.apiURL+'/api/Reportes/'
  UsuarioLogueado!: Usuario;
  constructor(private http: HttpClient) { 
    if (sessionStorage.getItem('session')) {
      this.UsuarioLogueado = JSON.parse(sessionStorage.getItem('session')!) || '';
    }
  }

  reporte(buscarPor:string,fechaInicio: string, fechaFin: string): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Reporte?buscarPor=${buscarPor}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&id_local=${this.UsuarioLogueado.idLocal}`);

  }
}
