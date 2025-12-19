import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { unit } from '../model/unit.model';
import { environment } from '../environments/environment';
import { pegawaiDinilai } from '../model/pegawai.model';

@Injectable({
  providedIn: 'root'
})
export class PpsmService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  ///// GET ////////
  getUnit() {
    return this.httpClient.get<unit[]>(this.baseUrl + 'Units/GetUnit')
  }

  ///// POST ///////
  simpanPegawaiBaru(object: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'PegawaiDinilais/SimpanPegawaiBaru',
      object,
      httpOptions
    );
  }

}
