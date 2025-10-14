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
import { BehaviorSubject, Observable } from 'rxjs';
import { pegawai } from '../model/employee.model';

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

  private tahunPenilaianSource = new BehaviorSubject<number | null>(null);
  tahunPenilaian$ = this.tahunPenilaianSource.asObservable();

  private kategoriPenilaianSource = new BehaviorSubject<string | null>(null);
  kategoriPenilaian$ = this.kategoriPenilaianSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  //GET
  getPegawaiDinilai(): Observable<pegawaiDinilai[]> {
    return this.httpClient.get<pegawaiDinilai[]>(this.baseUrl + 'PegawaiDinilais/GetPegawaiDinilai');
  }

  getMaklumatPenilai(noKP: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetMaklumatPenilai/${noKP}`);
  }

  getMaklumatPyd(noKP: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}Pegawais/pyd/${noKP}`);
  }

  getPegawaiById(id: number): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetById/${id}`);
  }

  getUnitPyd(namaUnit: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetUnitPyd/${namaUnit}`);
  }

  getMaklumatPydById(idPyd: number): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}Pegawais/pyd/details/${idPyd}`);
  }

  getAllPydByPppNoKp(noKP: string): Observable<pegawaiDinilai[]> {
    return this.httpClient.get<pegawaiDinilai[]>(
      `${this.baseUrl}Penilaians/GetAllPydByPppNoKp/${noKP}`
    );
  }

  //PUT
  updatePegawai(id: number, pegawai: pegawaiDinilai): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/${id}`, pegawai);
  }

  aktifkanPegawai(id: number, payload: { tahunPenilaian: number; idKategoriPenilaian: number }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/Aktifkan/${id}`, payload);
  }
  // aktifkanPegawai(id: number): Observable<any> {
  //   return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/Aktifkan/${id}`, {});
  // }


  // getSasaranByPyd(pydId: number) {
  // return this.httpClient.get<SasaranKerjaListItem[]>(
  //   `${this.baseUrl}SasaranKerjas/ByPyd/${pydId}`
  // );
  // aktifkanPegawai(id: number): Observable<any> {
  //   return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/Aktifkan/${id}`, {});
  // }

  //POST
  // bolehDinilai(id: number) {
  //   return this.httpClient.post<any>(`${this.baseUrl} PegawaiDinilai/${id}/bolehDinilai`, {});
  // }

  nilai(id: number) {
    return this.httpClient.post<any>(`${this.baseUrl} PegawaiDinilai/${id}/bolehDinilai`, {});
  }

  setTahunPenilaian(tahun: number | null) {
    this.tahunPenilaianSource.next(tahun);
  }

  setKategoriPenilaian(namaKategori: string | null) {
    this.kategoriPenilaianSource.next(namaKategori);
  }
}