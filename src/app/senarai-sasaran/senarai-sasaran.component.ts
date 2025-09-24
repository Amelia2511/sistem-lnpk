import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { pegawaiDinilai } from '../model/pegawai.model';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { userDTO } from '../model/userDTO.model';
import { SasaranKerjaService } from '../services/sasaran-kerja.service';
import { sasaranKerja } from '../model/sasaran-kerja.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-senarai-sasaran',
  imports: [ButtonModule, CardModule, TableModule, TagModule, CommonModule],
  templateUrl: './senarai-sasaran.component.html',
  styleUrl: './senarai-sasaran.component.css'
})
export class SenaraiSasaranComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private pydService = inject(PydService);

  user: userDTO = {} as userDTO;
  products: sasaranKerja[] = [];

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
              this.products = info;
            },
            error: (error) => {
              console.error("API Error:", error);
            }
          });
        }
      }
    });
  }

  onButtonClick() {
    this.router.navigate(['/sasaran']);
  }

  // products = [
  //   {
  //     tahunPenilaian: 2025,
  //     kategoriPenilaian: 'Semula',
  //     status: 'Draf'
  //   },
  //   {
  //     tahunPenilaian: 2025,
  //     kategoriPenilaian: 'Utama',
  //     status: 'Sah'
  //   },
  //   {
  //     tahunPenilaian: 2024,
  //     kategoriPenilaian: 'Semula',
  //     status: 'Sah'
  //   },
  //   {
  //     tahunPenilaian: 2024,
  //     kategoriPenilaian: 'Utama',
  //     status: 'Sah'
  //   },
  //   {
  //     tahunPenilaian: 2023,
  //     kategoriPenilaian: 'Semula',
  //     status: 'Sah'
  //   },
  //   {
  //     tahunPenilaian: 2023,
  //     kategoriPenilaian: 'Utama',
  //     status: 'Sah'
  //   },
  // ];
}
