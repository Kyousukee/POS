import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriasServiciosService {
  // apiBase: string = '/api/Categorias/'
  apiBase: string = GlobalConstants.apiURL+'/api/Categorias/'
  constructor(private http: HttpClient) { }

  getCategorias(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiBase}GetCategorias`)
  }
}
