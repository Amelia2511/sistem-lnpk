import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  get(): Observable<pegawai[]> {
    return this.http.get<pegawai[]>(this.baseUrl + 'Pegawais');
  }
  
  getPeranan(): Observable<peranan[]> {
    return this.http.get<peranan[]>(this.baseUrl + 'Peranans');
  }
  
}