import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { InputMask } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { daftarDTO } from '../model/daftarDTO.model';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-daftar-akaun',
  imports: [CommonModule, MatCardModule, InputMask, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './daftar-akaun.component.html',
  styleUrl: './daftar-akaun.component.css'
})

export class DaftarAkaunComponent {

  daftarUser: daftarDTO = {} as daftarDTO;
  repeatPassword: string | null = null;

  isPasswordTyping: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  goToLogMasuk() {
    if (!this.valid()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Fill in the required information'
      });
      this.reset();
      return;
    } else if (!this.passwordValid()) {
      Swal.fire({
        icon: 'warning',
        title: 'Wrong password format',
        text: 'Password must contain at least 6 characters and include at least one special character (!@#$%^&*...)'
      });
      this.resetPassword();
      return;
    }

    if (!this.passwordMatch()) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Error',
        text: 'Password does not match'
      });
      this.reset();
      return;
    }

    this.authService.daftarUser(this.daftarUser).subscribe(
      res => {
        this.reset();
        Swal.fire({
          icon: 'success',
          title: 'Information has been registered',
          text: 'Please login',
          timer: 6000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['log-masuk']);
        });
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error
        });
      }
    );
  }

  hasValidPassword(password: string): boolean {

    const minLength = 6;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    return password.length >= minLength && specialCharPattern.test(password);
  }

  valid(): boolean {
    return !(
      (this.daftarUser.noKP == null || this.daftarUser.noKP == "") ||
      (this.daftarUser.password == null || this.daftarUser.password == "") ||
      (this.repeatPassword == null || this.repeatPassword == "")
    );
  }

  passwordValid(): boolean {
    const password = this.daftarUser.password ?? '';
    return this.hasValidPassword(password);
  }

  passwordMatch(): boolean {
    return this.daftarUser.password == this.repeatPassword;
  }

  reset() {
    this.daftarUser = {} as daftarDTO;
    this.repeatPassword = null;
  }

  resetPassword() {
    this.daftarUser.password = '';
    this.repeatPassword = null;
  }

  goToLogin() {
    this.router.navigate(['/log-masuk']);
  }
}