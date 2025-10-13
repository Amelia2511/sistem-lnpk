import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
// import { sasaranKerja } from '../model/sasaran-kerja.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';

export interface sasaranKerja {
  idSkt: number;
  tahunPenilaian: number;
  namaKategoriPenilaian: string;
  namaStatus: string;
  idPYD: number | undefined;
  idStatus: number | undefined;
  idKategoriPenilaian: number | undefined;
  idPPP: number | undefined;
  idPPK: number | undefined;
  tarikhHantar: Date | undefined;
  tarikhSah: Date | undefined;
  createdAt: Date | undefined;
  updateAt: Date | undefined;
}

export interface SasaranAktivitiRow {
  idAktiviti: number;
  aktiviti: string;
  idPprestasi: number;
  jenisPetunjuk?: string | null;
  keterangan?: string | null;
  sasaranKerja?: number | null;
  pencapaianSebenar?: number | null;
  ulasan?: string | null;
}

export interface PendingSKT {
  idSkt: number;
  idPyd: number;
  namaPyd: string;
  noKpPyd: string;
  idPpp: number;
  idPpk: number;
  tahunPenilaian: number;
  tarikhHantar: Date;
  namaKategori: string;
  namaStatus: string;
}

export interface PengesahanRequest {
  idPegawaiPengesah: number;
  catatan?: string;
}

export interface PengesahanHistory {
  idPengesahan: number;
  idPegawaiPengesah: number;
  isSah: boolean;
  catatan: string;
  tarikhPengesahan: Date;
}

@Injectable({
  providedIn: 'root'
})

export class SasaranKerjaService {
  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getSasaranKerja(noKP: string): Observable<sasaranKerja[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}SasaranKerjas/GetSasaranKerja/${noKP}`)
      .pipe(map(rows => rows.map(r => ({
        idSkt: r.idSkt ?? r.id,
        tahunPenilaian: r.tahunPenilaian,
        namaKategoriPenilaian: r.namaKategoriPenilaian,
        namaStatus: r.namaStatus,
        idPYD: r.idPyd,
        idStatus: r.idStatus,
        idKategoriPenilaian: r.idKategoriPenilaian,
        idPPP: r.idPpp,
        idPPK: r.idPpk,
        tarikhHantar: r.tarikhHantar,
        tarikhSah: r.tarikhSah,
        createdAt: r.createdAt,
        updateAt: r.updateAt
      } as sasaranKerja))));
  }

  // bolehDinilai(idSkt: number, payload: { idstatus: number }): Observable<sasaranKerja[]> {
  //   return this.httpClient.put<sasaranKerja[]>(`${this.baseUrl}SasaranKerjas/BolehDinilai/${idSkt}`, payload);
  // }

  getSasaranKerjaById(idSkt: number) {
    return this.httpClient.get<Pick<sasaranKerja, 'idSkt' | 'tahunPenilaian' | 'namaKategoriPenilaian'>>(
      `${this.baseUrl}SasaranKerjas/${idSkt}`
    );
  }

  // getSasaranKerjaById(idSkt: number): Observable<sasaranKerja> {
  //   return this.httpClient.get<any>(`${this.baseUrl}SasaranKerjas/GetSasaranKerjaById/${idSkt}`);
  // }

  getAktivitiRows(idSkt: number): Observable<SasaranAktivitiRow[]> {
    return this.httpClient.get<SasaranAktivitiRow[]>(
      `${this.baseUrl}SasaranKerjas/${idSkt}/rows`
    );
  }

  // getPendingPengesahan(idPpp?: number): Observable<PendingSKT[]> {
  //   const params = idPpp ? { idPpp: idPpp.toString() } : {};
  //   return this.httpClient.get<PendingSKT[]>(`${this.baseUrl}/pending`, { params });
  // }

  // Sahkan SKT
  sahkanSkt(idSkt: number, request: PengesahanRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${idSkt}/sah`, request);
  }

  // Tidak sahkan SKT
  tidakSahkanSkt(idSkt: number, request: PengesahanRequest): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${idSkt}/tidak-sah`, request);
  }

  // Get pengesahan history
  getPengesahanHistory(idSkt: number): Observable<PengesahanHistory[]> {
    return this.httpClient.get<PengesahanHistory[]>(`${this.baseUrl}/${idSkt}/history`);
  }

}
