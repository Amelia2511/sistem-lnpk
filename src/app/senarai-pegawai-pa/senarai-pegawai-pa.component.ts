import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from '../services/employee.service';
import { PydService } from '../services/pyd.service';
import { pegawai } from '../model/employee.model';
import { pegawaiDinilai } from '../model/pegawai.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-senarai-pegawai-pa',
  imports: [ButtonModule, CardModule, DialogModule, TableModule, DropdownModule, CommonModule, FormsModule],
  templateUrl: './senarai-pegawai-pa.component.html',
  styleUrl: './senarai-pegawai-pa.component.css'
})
export class SenaraiPegawaiPaComponent implements OnInit {
  pegawais: pegawaiDinilai[] = [];
  allPegawaiList: pegawai[] = []; // List of all pegawai for dropdown
  loading = true;

  // Dialog state
  showDialog = false;
  selectedPyd: pegawaiDinilai | null = null;
  selectedPpp: pegawai | null = null;
  selectedPpk: pegawai | null = null;

  constructor(
    private pydService: PydService,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPegawais();
    this.loadAllPegawai();
  }

  loadPegawais(): void {
    this.loading = true;

    this.authService.currentUser.subscribe(user => {
      if (user && user.idUnit) {
        console.log('👤 Loading PYDs for unit:', user.idUnit);

        this.pydService.getPydByUnit(user.idUnit).subscribe({
          next: (data) => {
            this.pegawais = data;
            console.log('✅ Loaded PYDs:', this.pegawais);
            this.loading = false;
          },
          error: (err) => {
            console.error('❌ Error loading PYDs:', err);
            this.loading = false;
          }
        });
      } else {
        console.error('❌ No unit ID found for logged-in user');
        this.loading = false;
      }
    });
  }

  loadAllPegawai(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.idUnit) {
        this.employeeService.getPegawaiByUnit(user.idUnit).subscribe({
          next: (data) => {
            this.allPegawaiList = data;
          },
          error: (err) => {
          }
        });
      } else {
      }
    });
  }

  tetapkanPenilai(pegawai: pegawaiDinilai): void {
    this.selectedPyd = pegawai;
    this.selectedPpp = null;
    this.selectedPpk = null;

    this.showDialog = true;
  }

  async simpanPenilai(): Promise<void> {
    if (!this.selectedPyd) return;

    // Validation
    if (!this.selectedPpp && !this.selectedPpk) {
      await Swal.fire({
        icon: 'warning',
        title: 'Pengesahan Diperlukan',
        text: 'Sila pilih sekurang-kurangnya satu penilai (PPP atau PPK).'
      });
      return;
    }

    this.pydService.assignPenilai(
      this.selectedPyd?.id || null,
      this.selectedPpp?.id || null,
      this.selectedPpk?.id || null
    ).subscribe({
      next: async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berjaya',
          text: 'Penilai berjaya ditetapkan'
        });

        this.showDialog = false;
        this.loadPegawais();
      },
      error: async (err) => {
        console.error('❌ Error assigning penilai:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err?.error?.message || 'Ralat semasa menyimpan penilai'
        });
      }
    });
  }

  batalDialog(): void {
    this.showDialog = false;
    this.selectedPyd = null;
    this.selectedPpp = null;
    this.selectedPpk = null;
  }
}
