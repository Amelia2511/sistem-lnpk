import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { sasaranKerja } from '../model/sasaran-kerja.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SasaranKerjaService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  //skt
  getSasaranKerja(noKP: string): Observable<sasaranKerja[]> {
    return this.httpClient.get<sasaranKerja[]>(`${this.baseUrl}SasaranKerjas/GetSasaranKerja/${noKP}`);
  }

}
