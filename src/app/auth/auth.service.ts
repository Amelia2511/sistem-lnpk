import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { daftarDTO } from '../model/daftarDTO.model';
import { loginDTO } from '../model/loginDTO.model';
import { userDTO } from '../model/userDTO.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  private userSource = new BehaviorSubject<userDTO | null>(null);
  currentUser = this.userSource.asObservable();

  private loggedInSource = new BehaviorSubject(false);
  currentLoggedIn = this.loggedInSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  daftarUser(object: daftarDTO) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<daftarDTO>(
      this.baseUrl + 'Akauns/Daftar',
      object,
      httpOptions
    );
  }

  login(object: loginDTO) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<userDTO>(
      this.baseUrl + 'Akauns/Login',
      object,
      httpOptions
    );
  }

  changeIsLoggedIn(val: boolean) {
    this.loggedInSource.next(val)
  }

  changeUser(val: userDTO | null) {
    if (val) {
      this.userSource.next(val);
    }
  }

}
