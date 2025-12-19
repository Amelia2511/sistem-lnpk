import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Penilaian } from '../model/penilaian.model';
import { PenilaianService } from '../services/penilaian.service';
import { RoleStateService } from '../services/role-state.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';

@Component({
  selector: 'app-senarai-penilaian',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, DialogModule, TableModule, TagModule],
  templateUrl: './senarai-penilaian.component.html',
  styleUrl: './senarai-penilaian.component.css'
})

export class SenaraiPenilaianComponent implements OnInit {
  penilaians: Penilaian[] = [];
  loading = true;
  user: userDTO = {} as userDTO;
  isPpsm: boolean = false;

  constructor(
    private penilaianService: PenilaianService,
    private authService: AuthService,
    private roleStateService: RoleStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('🚀 SenaraiPenilaianComponent initialized');

    // Get logged-in user
    this.authService.currentUser.subscribe(res => {
      console.log('👤 Auth currentUser emitted:', res);

      if (res) {
        this.user = res;

        // ⭐ Check role immediately
        const currentRoles = this.roleStateService.getCurrentRoles();
        this.isPpsm = this.roleStateService.hasRole(5);

        console.log('👤 User loaded:', this.user);
        console.log('🔐 Current roles:', currentRoles);
        console.log('🔐 Is PPSM?', this.isPpsm);
        console.log('🔐 Has noKP?', !!this.user.noKP);

        // ⭐ Load data regardless of noKP for PPSM
        if (this.isPpsm || this.user.noKP) {
          this.loadPenilaians();
        } else {
          console.error('❌ No noKP found and not PPSM');
          this.loading = false;
        }
      } else {
        console.error('❌ No user found in currentUser');
        this.loading = false;
      }
    });
  }

  loadPenilaians(): void {
    if (this.isPpsm) {
      // ⭐ PPSM sees all SKTs (one row per SKT)
      console.log('🔍 Loading all SKTs for PPSM');
      this.penilaianService.getAllSktViews().subscribe({
        next: (data) => {
          this.penilaians = data;
          this.loading = false;
          console.log('✅ Loaded all SKT views:', this.penilaians);
        },
        error: (err) => {
          console.error('❌ Error loading SKT views:', err);
          console.error('❌ Error details:', err.error);
          console.error('❌ Status:', err.status);
          this.loading = false;
          if (err.status === 404) {
            this.penilaians = [];
          }
        }
      });
    } else {
      // ⭐ Regular users see only their penilaians
      console.log('🔍 Loading penilaians for noKP:', this.user.noKP);
      this.penilaianService.getPenilaiansByPpNoKp(this.user.noKP).subscribe({
        next: (data) => {
          this.penilaians = data;
          this.loading = false;
          console.log('✅ Loaded penilaians:', this.penilaians);
        },
        error: (err) => {
          console.error('❌ Error loading penilaians:', err);
          this.loading = false;
          if (err.status === 404) {
            this.penilaians = [];
          }
        }
      });
    }
  }

  // ⭐ Single method for viewing - works for both PPSM and regular users
  onViewPenilaian(item: Penilaian): void {
    let idPenilaian: number | undefined;

    if (this.isPpsm) {
      // For PPSM, prefer PPK's penilaian, fallback to PPP
      idPenilaian = item.idPenilaianPpk || item.idPenilaianPpp;
      console.log('👁️ PPSM viewing SKT:', item.idSkt, 'Penilaian:', idPenilaian);
    } else {
      // For regular users, use their own penilaian ID
      idPenilaian = item.idPenilaian;
      console.log('👁️ Viewing penilaian:', idPenilaian);
    }

    if (!idPenilaian) {
      console.error('❌ No Penilaian found');
      return;
    }

    this.router.navigate(['/penilaian', idPenilaian], {
      state: {
        tahunPenilaian: item.tahunPenilaian,
        kategoriPenilaian: item.kategoriPenilaian,
        namaPyd: item.namaPyd,
        noKpPyd: item.noKpPyd,
        idSkt: item.idSkt
      }
    });
  }

  onButtonClick(): void {
  }

  getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' {
    switch (status?.toLowerCase()) {
      case 'penilaian oleh ppp':
      case 'penilaian oleh ppk':
        return 'warning';
      case 'penilaian selesai':
      case 'penilaian selesai ppsm':
        return 'success';
      default:
        return 'secondary';
    }
  }
}
