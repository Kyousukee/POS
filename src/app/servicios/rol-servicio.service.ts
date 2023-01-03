import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import{ GlobalConstants } from '../components/reusable/global-constants';


@Injectable({
  providedIn: 'root'
})
export class RolServicioService {
  // apiBase: string = '/api/Roles/'
  apiBase: string = GlobalConstants.apiURL+'/api/Roles/'
  constructor(private http: HttpClient) { }

  getRoles(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiBase}GetRoles`)
  }
}
