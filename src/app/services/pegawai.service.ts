import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pegawai {
  id: number;
  nama: string;
  noKp: string;
  emel: string;
  namaJawatan: string;
  skimPerkhidmatan: string;
  gredHakiki: string;
  gredDisandang: string;
  kementerian: string;
  idBahagian: string;
  idUnit: string;
  namaUnit: string;
  isActive: boolean;
  createdAt: string;
  noFail: string;
  idBahagianNavigation?: Bahagian;
  idUnitNavigation?: Unit;
}

export interface Bahagian {
  idBahagian: string;
  namaBahagian: string;
  instant: string;
  status: boolean;
}

export interface Unit {
  id: string;
  namaUnit: string;
  instant: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PegawaiService {
  private apiUrl = 'http://localhost:5015/api';

  constructor(private http: HttpClient) { }

  // Get all employees
  getAllPegawai(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Pegawais`);
  }

  // Get employee by ID - Note: This endpoint may not exist in your API
  // getPegawaiById(id: number): Observable<Pegawai> {
  //   return this.http.get<Pegawai>(`${this.apiUrl}/Pegawais/${id}`);
  // }

  getPegawaiById(id: number): Observable<Pegawai> {
    return this.http.get<Pegawai>(`${this.apiUrl}/PegawaiDinilais/GetPegawaiById/${id}`);
  }

  getPegawaiPenilaiById(id: number): Observable<Pegawai> {
    return this.http.get<Pegawai>(`${this.apiUrl}/Pegawais/GetById/${id}`);
  }

  // Create new employee - Note: This endpoint may not exist in your API
  createPegawai(pegawai: Pegawai): Observable<Pegawai> {
    return this.http.post<Pegawai>(`${this.apiUrl}/Pegawais`, pegawai);
  }

  // Update employee - Note: This endpoint may not exist in your API
  updatePegawai(id: number, pegawai: Pegawai): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Pegawais/${id}`, pegawai);
  }

  // Delete employee - Note: This endpoint may not exist in your API
  deletePegawai(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Pegawais/${id}`);
  }

  // Get all departments - Note: This endpoint may not exist in your API
  getAllBahagian(): Observable<Bahagian[]> {
    return this.http.get<Bahagian[]>(`${this.apiUrl}/Bahagian`);
  }

  // Get all units
  getAllUnit(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/Units/GetUnit`);
  }

  // Test methods
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Test/db-connection`);
  }

  seedData(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Test/seed-data`, {});
  }

  getPegawai() {
    return this.pegawaiDinilai;
  }
  getPegawaiPenilaiPertama() {
    return this.pegawaiPenilaiPertama;
  }
  getPegawaiPenilaiKedua() {
    return this.pegawaiPenilaiKedua;
  }

  pegawaiDinilai = {
    nama: 'Yaya',
    gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
    noKp: '123456789012',
    jawatan: 'Pegawai adsfa Maklumat',
    bahagian: 'Bahagian Perkhidmatan dan Sokongan',
    gred: 'F14',
    unit: 'Unit Teknologi Maklumat',
    idPPP: 1,
    idPPK: 2,
  };

pegawaiPenilaiPertama = {
  nama: 'Saraliza',
  gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
  noKp: '123456789012',
  jawatan: 'Pegawai Teknologi Maklumat',
  bahagian: 'Bahagian Perkhidmatan dan Sokongan',
  gred: 'F48',
  unit: 'Unit Teknologi Maklumat'
};

pegawaiPenilaiKedua = {
  nama: 'Mimi Safinaz Jamaluddin',
  gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
  noKp: '123456789014',
  jawatan: 'Pegawai Teknologi Maklumat',
  bahagian: 'Bahagian Perkhidmatan dan Sokongan',
  gred: 'F54',
  unit: 'Unit Teknologi Maklumat'
};

}
