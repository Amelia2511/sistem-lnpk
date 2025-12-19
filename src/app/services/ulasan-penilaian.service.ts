import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { SahkanPenilaianRequest, SaveUlasanRequest, UlasanCombinedView, UlasanPenilaian } from '../model/ulasan-penilaian.model';

@Injectable({
  providedIn: 'root'
})
export class UlasanPenilaianService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Get ulasan by penilaian ID
  getUlasanByPenilaian(idPenilaian: number): Observable<UlasanPenilaian> {
    return this.http.get<UlasanPenilaian>(`${this.baseUrl}UlasanPenilaians/GetByPenilaian/${idPenilaian}`);
  }

  getUlasanBySkt(idSkt: number): Observable<UlasanCombinedView> {
    return this.http.get<UlasanCombinedView>(`${this.baseUrl}UlasanPenilaians/GetBySkt/${idSkt}`);
  }

  // Save ulasan (create or update)
  saveUlasan(request: SaveUlasanRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}UlasanPenilaians/Save`, request);
  }

  // Submit ulasan (marks as submitted)
  submitUlasan(request: SaveUlasanRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}UlasanPenilaians/Submit`, request);
  }

  sahkanPenilaian(request: SahkanPenilaianRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}Penilaians/SahkanPenilaian`, request);
  }

}
