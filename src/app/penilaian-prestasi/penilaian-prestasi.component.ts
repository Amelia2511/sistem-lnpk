import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaklumatPpComponent } from '../maklumat-pp/maklumat-pp.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RoleStateService } from '../services/role-state.service';
import { CommonModule } from '@angular/common';
import { SenaraiSoalanComponent } from "../senarai-soalan/senarai-soalan.component";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PenilaianService } from '../services/penilaian.service';
import { Penilaian } from '../model/penilaian.model';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { MaklumatPydComponent } from '../maklumat-pyd/maklumat-pyd.component';

@Component({
  selector: 'app-penilaian-prestasi',
  imports: [MaklumatPydComponent, ButtonModule, CardModule, DialogModule, DividerModule, StepperModule, TableModule, TagModule, CommonModule, SenaraiSoalanComponent, InputTextModule, FormsModule, MatButtonModule],
  templateUrl: './penilaian-prestasi.component.html',
  styleUrl: './penilaian-prestasi.component.css'
})
export class PenilaianPrestasiComponent implements OnInit {

  private roleState = inject(RoleStateService);
  roles$ = this.roleState.roles$;
  roles: number[] = [];

  ulasanPPP: string = '';
  ulasanPPK: string = '';
  idPenilaian: number | null = null;
  idPyd: number | null = null;
  idSkt: number | null = null;
  details: Penilaian = {} as Penilaian;
  penilaianList: any[] = [];  // will hold PPP & PPK records

  constructor(private router: Router, private route: ActivatedRoute, private penilaian: PenilaianService, private authService: AuthService) { }

  resetForm(): void {
    this.ulasanPPP = '';
    this.ulasanPPK = '';
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.noKP) {
        console.log("PPP noKp:", user.noKP);

        this.penilaian.getLatestPydPenilaianByPppNoKp(user.noKP).subscribe({
          next: (res) => {
            console.log("PYD Penilaian Info:", res);

            this.idPyd = res.idPyd;
            this.idSkt = res.idSkt;
            console.log("Id Skt:", this.idSkt);
            this.idPenilaian = res.idPenilaian ?? null;

            if (this.idPenilaian) {
              this.penilaian.setIdPenilaian(this.idPenilaian);
            } else {
              console.warn("No Penilaian ID found for this PYD.");
            }
          },
          error: (err) => {
            console.error("Error fetching PYD info:", err);
          }
        });
      } else {
        console.warn("No PPP or noKp found in authService.");
      }
      if (this.idSkt !== null) {
        this.penilaian.getSasaranPyd(this.idSkt).subscribe(res => {
          console.log("Maklumat Pyd API Response:", res);

          this.details = Array.isArray(res) ? res[0] : res;

          console.log("Details set to:", this.details);
        });
      }
    });

    this.roleState.idPyd$.subscribe(id => {
      if (id) {
        this.idPyd = id;
        console.log("Received idPyd from Laman Utama:", id);
      }
    });

    // Roles
    this.roles$.subscribe(r => {
      this.roles = r;
      console.log("roles from service:", r);
    });
  }

  shouldShow(roles: number[]): boolean {
    const has3or4 = roles.includes(3) || roles.includes(4);
    const has5Only = roles.length === 1 && roles[0] === 5;
    const isAdmin = roles.includes(7); // admin override
    return isAdmin || has3or4 || !has5Only;
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }

  simpan(): void {
    if (!this.idPenilaian) {
      Swal.fire({
        icon: 'error',
        title: 'Ralat!',
        text: 'ID Penilaian tidak ditemukan. Sila cuba lagi.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check that at least one of PPP or PPK ulasan is filled
    if (!this.ulasanPPP.trim() && !this.ulasanPPK.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian!',
        text: 'Sila isi sekurang-kurangnya satu ulasan (PPP atau PPK).',
        confirmButtonText: 'OK'
      });
      return;
    }

    // 🟢 Combine or choose which ulasan to send
    let combinedUlasan = '';
    if (this.ulasanPPP.trim()) {
      combinedUlasan += `${this.ulasanPPP.trim()}`;
    }
    if (this.ulasanPPK.trim()) {
      if (combinedUlasan) combinedUlasan += ' | ';
      combinedUlasan += `${this.ulasanPPK.trim()}`;
    }

    // Prepare data for API
    const payload = {
      idUlasanPenilaian: 0, // Let backend auto-generate
      idPenilaian: this.idPenilaian,
      ulasan: combinedUlasan,
      tempohPengawasan: null,
      tarikhSahUlasan: null,
      createdAt: null,
      updateAt: null
    };

    this.penilaian.simpanUlasanPenilaian(payload).subscribe({
      next: (response) => {
        console.log("API response:", response);
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: 'Ulasan berjaya disimpan.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.resetForm();
        });
      },
      error: (err) => {
        console.error("Save failed:", err);
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: err.error?.message || 'Ralat berlaku semasa menyimpan. Sila cuba lagi.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
