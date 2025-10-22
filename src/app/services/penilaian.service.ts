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
import { markahSoalan } from '../model/markah-soalan.model';
import { penilaian } from '../model/penilaian.model';
import { pegawaiDinilai } from '../model/pegawai.model';

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

  getLatestPydPenilaianByPppNoKp(noKp: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}Penilaians/GetLatestPydPenilaianByPppNoKp/${noKp}`
    );
  }

  getLatestPydPenilaianByPpkNoKp(noKp: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}Penilaians/GetLatestPydPenilaianByPpkNoKp/${noKp}`);
  }

  getSasaranPyd(id: number): Observable<pegawaiDinilai> {
    console.log("id", id)
    return this.httpClient.get<pegawaiDinilai>(`${this.baseUrl}Penilaians/pyd/${id}`);
  }

  getMarkahByPenilaian(idPenilaian: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}GetMarkahByPenilaian/${idPenilaian}`);
  }

  // getPenilaianById(id: number): Observable<any> {
  //   return this.httpClient.get<any>(`${this.baseUrl}Penilaians/GetPenilaian/${id}`).pipe(
  //     tap(res => {
  //       if (res && res.idPenilaian) {
  //         this.setIdPenilaian(res.idPenilaian); // save globally
  //         console.log("Got idPenilaian:", res.idPenilaian);
  //       } else {
  //         console.warn("No idPenilaian returned from GetPenilaian API");
  //       }
  //     })
  //   );
  // }

  getPenilaianById(idPyd: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}Penilaians/GetPenilaianByIdPyd/${idPyd}`);
  }

  getMarkah(noKP: string): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.baseUrl}MarkahSoalans/GetMarkah/${noKP}`);
  }

  getMarkahSoalan(idPenilaian: number): Observable<markahSoalan[]> {
    return this.httpClient.get<markahSoalan[]>(`${this.baseUrl}MarkahSoalan/GetMarkahSoalan/${idPenilaian}`);
  }

  getSasaranById(idPyd: number): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.baseUrl}SasaranKerjas/GetSasaranByIdPyd/${idPyd}`);
  }

  getIdSktByIdPyd(idPyd: number) {
    return this.httpClient.get<{ idSkt: number }>(`${this.baseUrl}SasaranKerjas/GetIdSktByIdPyd/${idPyd}`);
  }

  getPppMarkahSoalanByPpkPenilaian(idPenilaian: number): Observable<markahSoalan[]> {
    return this.httpClient.get<markahSoalan[]>(
      `${this.baseUrl}MarkahSoalan/penilaian/${idPenilaian}/ppp`
    );
  }

  getAllBySkt(idSkt: number) {
    return this.httpClient.get<penilaian[]>(`${this.baseUrl}/Penilaian/GetAllBySkt/${idSkt}`);
  }

  simpanAtauKemaskiniUlasan(ulasan: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}SimpanAtauKemaskini`, ulasan);
  }

  // getMaklumatPenilaian(idPenilaian: number): Observable<any> {
  //   return this.httpClient.get<any>(`${this.baseUrl}Penilaians/GetMaklumatPenilaian/${idPenilaian}`);
  // }

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

  createPenilaianForSKT(idSkt: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'Penilaians/CreatePenilaianForSKT/',
      idSkt,
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