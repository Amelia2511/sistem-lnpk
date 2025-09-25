import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { pegawai } from '../model/employee.model';
import { ButtonModule } from 'primeng/button';
import { HttpErrorResponse } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SelectModule } from 'primeng/select';
import { peranan } from '../model/peranan.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { pegawaiDinilai } from '../model/pegawai.model';
import { PpsmService } from '../services/ppsm.service';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-senarai-peranan',
  imports: [ButtonModule, RouterModule, DropdownModule, CommonModule, FormsModule, SelectModule, CardModule],
  templateUrl: './senarai-peranan.component.html',
  styleUrl: './senarai-peranan.component.css'
})

export class SenaraiPerananComponent implements OnInit {
  pegawaiList: pegawai[] = [];
  selectedPegawai: pegawai | null = null;
  perananList: peranan[] = [];
  selectedPeranan: peranan | null = null;
  user: userDTO = {} as userDTO;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getSenaraiPegawai();
    this.getSenaraiPeranan();

    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
      }
    });
  }

  getSenaraiPegawai() {
    this.employeeService.getPegawai().subscribe({
      next: (data: pegawai[]) => {
        this.pegawaiList = data;
      },
      error: (err: HttpErrorResponse) => {
      }
    });
  }

  getSenaraiPeranan() {
    this.employeeService.getPeranan().subscribe({
      next: (data: peranan[]) => {
        this.perananList = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load peranan data:', err.message);
      }
    });
  }

  simpan() {
    if (!this.selectedPegawai || !this.selectedPeranan) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Sila pilih pegawai dan peranan sebelum simpan.',
        confirmButtonText: 'OK'
      });
      return; // stop here
    }

    const payload = {
      noKP: this.selectedPegawai.noKP,
      roleId: this.selectedPeranan.idPeranan,
      isActive: true,
      addedBy: this.user.noKP
    };

    this.employeeService.simpanPeranan(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: 'Peranan berjaya disimpan.',
          confirmButtonText: 'OK'
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: 'Gagal menyimpan peranan. Sila cuba lagi.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  capitalizeWords(value: string | null | undefined): string {
    if (!value) return 'Tiada maklumat';
    return value
      .toLowerCase()
      .split(' ')
      .filter(word => word.trim() !== '') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}