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

  bolehDinilai(id: number, payload: BolehDinilaiRequest): Observable<BolehDinilaiResponse> {
    return this.httpClient.post<BolehDinilaiResponse>(`${this.baseUrl}SasaranKerjas/${id}/bolehDinilaiPpp`, payload);
  }
}
