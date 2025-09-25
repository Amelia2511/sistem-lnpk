import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pegawai } from '../model/employee.model';
import { environment } from '../environments/environment';
import { peranan } from '../model/peranan.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPegawai(): Observable<pegawai[]> {
    return this.http.get<pegawai[]>(this.baseUrl + 'Pegawais/GetPegawai');
  }
  
  getPeranan(): Observable<peranan[]> {
    return this.http.get<peranan[]>(this.baseUrl + 'Peranans/GetPeranan');
  }

  simpanPeranan(object: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(
      this.baseUrl + 'Peranans/Peranan',
      object,
      httpOptions
    );
  }
}