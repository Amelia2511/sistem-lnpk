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
  namaPegawaiDinilai: string;
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

export interface AktivitiDetail {
  idAktiviti: number;
  idSkt: number | null;
  namaAktiviti: string | null;
  petunjuk: {
    idPprestasi?: number | null;
    jenis?: string | null;
    keterangan?: string | null;
    sasaranKerja?: number | null;
    pencapaianSebenar?: number | null;
    ulasan?: string | null;
  }[];
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
  getSasaranKerjaPpp(noKP: string): Observable<sasaranKerja[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}SasaranKerjas/GetSasaranKerjaPPP/${noKP}`)
    .pipe(map(rows => rows.map(r => ({
      idSkt: r.idSkt ?? r.id,
      tahunPenilaian: r.tahunPenilaian,
      namaKategoriPenilaian: r.namaKategoriPenilaian,
      namaStatus: r.namaStatus,
      idPYD: r.idPyd,
      namaPegawaiDinilai: r.namaPegawaiDinilai,
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

  getAktivitiDetail(idAktiviti: number) {
    return this.httpClient.get<AktivitiDetail>(`${this.baseUrl}Aktiviti/${idAktiviti}`);
  }

  updateAktiviti(idAktiviti: number, body: { namaAktiviti: string; petunjuk: any[] }) {
    return this.httpClient.put(`${this.baseUrl}Aktiviti/${idAktiviti}`, body);
  }

  deleteAktiviti(idAktiviti: number) {
    return this.httpClient.delete(`${this.baseUrl}Aktiviti/${idAktiviti}`);
  }

  // updateStatusPenilaian(idSkt: number, status: number) {
  //   return this.httpClient.patch(`${this.baseUrl}SasaranKerjas/${idSkt}/status`, status);
  // }

  hantarSasaran(idSkt: number) {
    return this.httpClient.post(`${this.baseUrl}SasaranKerjas/${idSkt}/hantar`, {});
  }

  sahkanSasaran(idSkt: number) {
    return this.httpClient.post(`${this.baseUrl}SasaranKerjas/${idSkt}/sahkan`, {});
  }

  tidakSahSasaran(idSkt: number) {
    return this.httpClient.post(`${this.baseUrl}SasaranKerjas/${idSkt}/tidakSahkan`, {});
  }

  getSasaranById(idSkt: number) {
    return this.httpClient.get<{
      idSkt: number;
      tahunPenilaian: number;
      namaKategoriPenilaian: string;
      idStatus: number | null;
      namaStatus: string | null;
    }>(`${this.baseUrl}SasaranKerjas/${idSkt}`);
  }
}
