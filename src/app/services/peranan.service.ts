import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pegawaiDinilai } from '../model/pegawai.model';

@Injectable({
  providedIn: 'root'
})
export class PerananService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  // getSenaraiPeranan(): Observable<[]> {
  //   return this.httpClient.get<[]>(this.baseUrl + 'PegawaiDinilais/GetPegawaiDinilai');
  // }

  getRolesById(id: number): Observable<number[] | null> {
    return this.httpClient.get<number[] | null>(`${this.baseUrl}PegawaiDinilais/GetRoleById/${id}`);
  }

  getRoleInPeranan(noKP: string): Observable<number[] | null> {
    return this.httpClient.get<number[] | null>(`${this.baseUrl}SenaraiPeranans/GetRoleInPeranan/${noKP}`);
  }

  getAsPyd(noKP: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}PegawaiDinilais/GetAsPyd/${noKP}`);
  }

}
