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

  constructor(private httpClient: HttpClient) {
    // 🔹 Restore user on refresh
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSource.next(JSON.parse(savedUser));
      this.loggedInSource.next(true);
    }
  }

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
    this.loggedInSource.next(val);
    if (!val) {
      localStorage.removeItem('user'); // clear if log out
    }
  }

  changeUser(val: userDTO | null) {
    this.userSource.next(val);
    if (val) {
      localStorage.setItem('user', JSON.stringify(val)); // persist
    } else {
      localStorage.removeItem('user');
    }
  }

  getUserDTO(): userDTO | null {
    return this.userSource.value;
  }

  logout() {
    this.userSource.next(null);
    this.loggedInSource.next(false);
    localStorage.removeItem('user');
  }
}
