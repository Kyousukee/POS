import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import{ GlobalConstants } from '../components/reusable/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PorCobrarservicioService {
  // apiBase: string = '/api/CobrarPor/'
  apiBase: string = GlobalConstants.apiURL+'/api/CobrarPor/'
  constructor(private http: HttpClient) { }

  getCobros(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.apiBase}GetCobros`)
  }
}
