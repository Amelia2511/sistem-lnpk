import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';
import { sasaranKerja, SasaranKerjaService } from '../services/sasaran-kerja.service';
// import { sasaranKerja } from '../model/sasaran-kerja.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-senarai-sasaran',
  imports: [CommonModule, ButtonModule, CardModule, DialogModule, TableModule, TagModule],
  templateUrl: './senarai-sasaran.component.html',
  styleUrl: './senarai-sasaran.component.css'
})
export class SenaraiSasaranComponent {
  private router = inject(Router);

  user: userDTO = {} as userDTO;
  skts: sasaranKerja[] = [];

  constructor(
    private authService: AuthService,
    private sasaranKerjaService: SasaranKerjaService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log("User noKP:", this.user.noKP);

        if (this.user.noKP) {
          this.sasaranKerjaService.getSasaranKerja(this.user.noKP).subscribe({
            next: (info) => {
              console.log("API response:", info);
              this.skts = info;
            },
            error: (error) => {
              console.error("API Error:", error);
            }
          });
        }
      }
    });
  }

  onButtonClick(skt: sasaranKerja) {
    this.router.navigate(
      ['/sasaran'],
      {
      queryParams: { idSkt: skt.idSkt },
      state: {
        idSkt: skt.idSkt,
        tahunPenilaian: skt.tahunPenilaian,
        namaKategoriPenilaian: skt.namaKategoriPenilaian
      }
      }
    );
  }
}
