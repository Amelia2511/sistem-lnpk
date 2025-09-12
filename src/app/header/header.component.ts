import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService:AuthService, private router:Router) {}

  Logout(){
    this.authService.changeIsLoggedIn(false);
    this.authService.changeUser({} as userDTO);
    this.router.navigate(['log-masuk']);
    Swal.fire({
      icon: 'success',
      title: 'Log Keluar Berjaya',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
