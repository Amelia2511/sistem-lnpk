import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pegawai } from '../model/employee.model';
import { environment } from '../environments/environment';
import { peranan } from '../model/peranan.model';
import { pegawaiDinilai } from '../model/pegawai.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getPegawai(): Observable<pegawai[]> {
    return this.httpClient.get<pegawai[]>(this.baseUrl + 'Pegawais/GetPegawai');
  }

  getPeranan(): Observable<peranan[]> {
    return this.httpClient.get<peranan[]>(this.baseUrl + 'Peranans/GetPeranan');
  }

  getMaklumatPyd(noKP: string): Observable<pegawai> {
    return this.httpClient.get<pegawai>(`${this.baseUrl}Pegawais/pyd/${noKP}`);
  }

  simpanPeranan(object: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'Peranans/Peranan',
      object,
      httpOptions
    );
  }
}