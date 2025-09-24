import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { loginDTO } from '../model/loginDTO.model';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, MatCardModule, InputMaskModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  user: loginDTO = {} as loginDTO

  constructor(private router: Router, private authService: AuthService) { }

  goToDaftarAkaun() {
    this.router.navigate(['/daftar-akaun']);
  }

  goToLamanUtama() {
    if (!this.user.noKP || !this.user.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Fill in the required information',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.authService.login(this.user).subscribe({
      next: res => {
        if (res != null) {
          localStorage.setItem('user', JSON.stringify(res));

          this.authService.changeIsLoggedIn(true);
          this.authService.changeUser(res);

          this.router.navigate(['/laman-utama']);

          Swal.fire({
            icon: 'success',
            title: 'Selamat Datang!',
            text: 'Anda telah berjaya log masuk',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Log Masuk Gagal',
            text: 'Pengguna tidak dijumpai',
            confirmButtonText: 'Cuba Lagi'
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Log Masuk Gagal',
          text: err.error || 'Ralat berlaku semasa log masuk.',
          confirmButtonText: 'Cuba Lagi'
        });
      }
    });
  }

  onLogin(form: any) {
    if (form.valid) {
      this.router.navigate(['/laman-utama']);
    }
  }

}
