import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { markahSoalan } from '../model/markah-soalan.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MarkahSoalanService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  // GET //
  getMarkahSoalan(markah: string): Observable<markahSoalan[]> {
    return this.httpClient.get<markahSoalan[]>(this.baseUrl + 'MarkahSoalans/GetMarkahSoalan');
  }

  ///// POST ///////
  simpanMarkahSoalan(object: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'MarkahSoalans/SimpanMarkahSoalan',
      object,
      httpOptions
    );
  }

  // simpanMultipleMarkahSoalan(records: any[]): Observable<any> {
  //   console.log('Service: Calling multiple records endpoint with:', records);
  //   return this.httpClient.post<any>(this.baseUrl + 'MarkahSoalans/SimpanMultipleMarkahSoalan/Multiple', records);
  // }

  simpanMultipleMarkahSoalan(records: any[]): Observable<any> {
    console.log('Service: Calling multiple records endpoint with:', records);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'MarkahSoalans/SimpanMultipleMarkahSoalan/Multiple', records,
      httpOptions
    );
  }

  getMarkahSoalanByPenilaian(idPenilaian: number): Observable<markahSoalan[]> {
    return this.httpClient.get<markahSoalan[]>(this.baseUrl + `MarkahSoalans/ByPenilaian/${idPenilaian}`);
  }

}
