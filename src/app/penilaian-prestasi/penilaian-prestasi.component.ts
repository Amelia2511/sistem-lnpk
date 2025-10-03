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
import { penilaian } from '../model/penilaian.model';
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
  details: penilaian = {} as penilaian;

  constructor(private router: Router, private route: ActivatedRoute, private penilaian: PenilaianService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.noKP) {
        this.penilaian.getLatestPenilaianByNoKp(user.noKP).subscribe();
      }
    });

    // Subscribe to the shared service
    this.penilaian.idPenilaian$.subscribe(id => {
      this.idPenilaian = id;
      console.log(" idPenilaian from service:", id);
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

    if (!this.ulasanPPP.trim() && !this.ulasanPPK.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian!',
        text: 'Sila isi sekurang-kurangnya satu ulasan (PPP atau PPK).',
        confirmButtonText: 'OK'
      });
      return;
    }

    const payload = {
      idUlasanPenilaian: 0, // let backend auto-generate
      idPenilaian: this.idPenilaian,
      ulasan: (this.ulasanPPP + " " + this.ulasanPPK).trim(),
      tempohPengawasan: null,
      tarikhSahUlasan: null,
      createdAt: null,
      updateAt: null
    };

    this.penilaian.simpanUlasanPenilaian(payload).subscribe({
      next: (info) => {
        console.log("API response:", info);
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: 'Ulasan berjaya disimpan.',
          confirmButtonText: 'OK'
        });
        return;
      },
      error: (err) => {
        console.error("Save failed:", err);
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: err.error?.message || 'Ralat berlaku semasa menyimpan. Sila cuba lagi.',
          confirmButtonText: 'OK'
        });
        return;
      }
    });
  }

}
