// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '../environments/environment';
// import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
// import { ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class PenilaianService {

//   baseUrl = environment.baseUrl;

//   constructor(private httpClient: HttpClient, private route: ActivatedRoute, private penilaianService: PenilaianService) { }

//   // simpanUlasanPenilaian(object: any) {
//   //   const httpOptions = {
//   //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   //   };
//   //   return this.httpClient.post<any>(
//   //     this.baseUrl + 'MarkahSoalans/SimpanUlasanPenilaian',
//   //     object,
//   //     httpOptions
//   //   );
//   // }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PenilaianService {

  baseUrl = environment.baseUrl;

  private idPenilaianSource = new BehaviorSubject<number | null>(null);
  idPenilaian$ = this.idPenilaianSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  // Get //

  getLatestPenilaianByNoKp(noKp: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}Penilaians/GetLatestPenilaianByNoKp/${noKp}`).pipe(
      tap(res => {
        if (res && res.idPenilaian) {
          this.setIdPenilaian(res.idPenilaian);
        } else {
          console.warn(" No idPenilaian returned from API");
        }
      })
    );
  }

  getMarkah(noKP: string): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.baseUrl}MarkahSoalans/GetMarkah/${noKP}`);
  }

  ///// POST ///////
  simpanPenilaian(object: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'Penilaians/SimpanPenilaian',
      object,
      httpOptions
    );
  }

  setIdPenilaian(id: number) {
    this.idPenilaianSource.next(id);
    localStorage.setItem("idPenilaian", id.toString()); // persist
  }

  getSavedIdPenilaian(): number | null {
    const saved = localStorage.getItem("idPenilaian");
    return saved ? +saved : null;
  }

  ///// Save Ulasan ///////
  simpanUlasanPenilaian(payload: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}UlasanPenilaians/SimpanUlasanPenilaian`,
      payload
    );
  }

}
