import { Component } from '@angular/core';
import { StatusPenilaianComponent } from '../status-penilaian/status-penilaian.component';
import { MaklumatPpComponent } from '../maklumat-pp/maklumat-pp.component';
import { userDTO } from '../model/userDTO.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-laman-utama',
  imports: [StatusPenilaianComponent, MaklumatPpComponent],
  templateUrl: './laman-utama.component.html',
  styleUrl: './laman-utama.component.css'
})
export class LamanUtamaComponent {
  user: userDTO = {} as userDTO;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log(this.user, "Maklumat 1");
      }
    });

  }
}
