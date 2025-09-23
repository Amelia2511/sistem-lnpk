// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { unit } from '../model/unit.model';
// import { environment } from '../environments/environment';
// import { pegawaiDinilai } from '../model/pegawai.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class PydService {

//   updatePegawai(id: any, pegawai: any) {
//     throw new Error('Method not implemented.');
//   }
//   getPegawaiById(id: number) {
//     throw new Error('Method not implemented.');
//   }
//   baseUrl = environment.baseUrl;

//   constructor(private httpClient: HttpClient) { }

//   ///// GET ////////
//   getPegawaiDinilai() {
//     return this.httpClient.get<pegawaiDinilai[]>(this.baseUrl + 'PegawaiDinilais/GetPegawaiDinilai')
//   }

//   ///// POST ///////
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { pegawaiDinilai } from '../model/pegawai.model';
import { Observable } from 'rxjs';

export interface SasaranKerjaListItem {
  idSkt: number;
  tahunPenilaian: number;
  kategoriPenilaian: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PydService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getPegawaiDinilai(): Observable<pegawaiDinilai[]> {
    return this.httpClient.get<pegawaiDinilai[]>(this.baseUrl + 'PegawaiDinilais/GetPegawaiDinilai');
  }

  getPegawaiById(id: number): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/${id}`);
  }

  getMaklumatPenilai(noKP: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetMaklumatPenilai/${noKP}`);
  }

  updatePegawai(id: number, pegawai: pegawaiDinilai): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/${id}`, pegawai);
  }

  aktifkanPegawai(id: number, payload: { tahunPenilaian: number; idKategoriPenilaian: number }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/Aktifkan/${id}`, payload);
  }

  getSasaranByPyd(pydId: number) {
  return this.httpClient.get<SasaranKerjaListItem[]>(
    `${this.baseUrl}SasaranKerjas/ByPyd/${pydId}`
  );
}
}