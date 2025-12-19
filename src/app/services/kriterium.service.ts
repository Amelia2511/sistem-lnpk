import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Kriterium, SaveMarkahRequest } from '../model/kriterium.model';

@Injectable({
  providedIn: 'root'
})
export class KriteriumService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllKriteria(): Observable<Kriterium[]> {
    return this.http.get<Kriterium[]>(`${this.baseUrl}Kriterium`);
  }

  getMarkahByPenilaian(idPenilaian: number): Observable<any> {
    return this.http.get(`${this.baseUrl}MarkahSoalan/GetByPenilaian/${idPenilaian}`);
  }

  // Add method to get marks by SKT
  getMarkahBySkt(idSkt: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Kriterium/GetMarkahBySkt/${idSkt}`);
  }

  saveMarkah(request: SaveMarkahRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}MarkahSoalan/SaveMarkah`, request);
  }

  getPurataBySkt(idSkt: number): Observable<any> {
    return this.http.get(`${this.baseUrl}Purata/GetBySkt/${idSkt}`);
  }

  getPurataHistoryBySkt(idSkt: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Purata/GetHistoryBySkt/${idSkt}`);
  }
}
