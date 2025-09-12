import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerananService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  // getSenaraiPeranan(): Observable<[]> {
  //   return this.httpClient.get<[]>(this.baseUrl + 'PegawaiDinilais/GetPegawaiDinilai');
  // }
}
