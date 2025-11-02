import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { pegawaiDinilai } from '../model/pegawai.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { pegawai } from '../model/employee.model';
import { markahSoalan } from '../model/markah-soalan.model';

export interface SasaranKerjaListItem {
  idSkt: number;
  tahunPenilaian: number;
  kategoriPenilaian: string;
  status: string;
}

export interface BolehDinilaiRequest {
  tahunPenilaian: number;
  idKategoriPenilaian: number;
}

export interface BolehDinilaiResponse {
  message: string;
  idPegawai: number;
  idSasaranKerja: number;
  idStatus: number;
  tahun: number;
  kategori: number;
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

  getPegawaiById(id: number): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/${id}`);
  }

  getPegawaiByPp(noKpPp: string): Observable<pegawaiDinilai[]> {
  return this.httpClient.get<pegawaiDinilai[]>(
    `${this.baseUrl}PegawaiDinilais/GetPydByPp/${noKpPp}`
  );
}
  getMaklumatPenilai(noKP: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetMaklumatPenilai/${noKP}`);
  }

  getMaklumatPyd(noKP: string): Observable<pegawaiDinilai> {
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}Pegawais/pyd/${noKP}`);
  }

  // getPegawaiById(id: number): Observable<pegawaiDinilai> {
  //   return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}PegawaiDinilais/GetById/${id}`);
  // }

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

  getMarkahByPyd(idPyd: number): Observable<markahSoalan[]> {
    return this.httpClient.get<markahSoalan[]>(`${this.baseUrl}Penilaian/pyd/${idPyd}`);
  }

  //PUT
  updatePegawai(id: number, pegawai: pegawaiDinilai): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/${id}`, pegawai);
  }

  aktifkanPegawai(id: number, payload: { tahunPenilaian: number; idKategoriPenilaian: number }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}PegawaiDinilais/Aktifkan/${id}`, payload);
  }

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

  bolehDinilai(id: number, payload: BolehDinilaiRequest): Observable<BolehDinilaiResponse> {
    return this.httpClient.post<BolehDinilaiResponse>(
      `${this.baseUrl}SasaranKerjas/${id}/bolehDinilaiPpp`,
      payload
    );
  }

  bolehDinilaiPpk(id: number, payload: BolehDinilaiRequest): Observable<BolehDinilaiResponse> {
    return this.httpClient.post<BolehDinilaiResponse>(
      `${this.baseUrl}SasaranKerjas/${id}/bolehDinilaiPpk`,
      payload
    );
  }

}
