import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { pegawaiDinilai } from '../model/pegawai.model';
import { unit } from '../model/unit.model';
import { PpsmService } from '../services/ppsm.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { InputMask } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-daftar-kakitangan-baru',
  imports: [FormsModule, CommonModule, InputMask, MatDatepickerModule, MatIconModule, MatInputModule, DatePickerModule, FluidModule, CalendarModule, BreadcrumbModule, DatePicker, ButtonModule, RouterModule, SelectModule],
  templateUrl: './daftar-kakitangan-baru.component.html',
  styleUrl: './daftar-kakitangan-baru.component.css'
})
export class DaftarKakitanganBaruComponent {
  formData: any;
  toggleinput: unknown;
  details: pegawaiDinilai = {} as pegawaiDinilai;

  units: unit[] = [];

  items: MenuItem[] = [{ label: 'Senarai', routerLink: '/senarai-pegawai' }, { label: 'Tambah Pegawai', routerLink: '/daftar-anggota' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  constructor(private router: Router, private ppsm: PpsmService) { }

  ngOnInit(): void {
    this.ppsm.getUnit().subscribe(res => this.units = res);
  }

simpan() {
  
  if (
    !this.details.noKP ||
    !this.details.nama ||
    !this.details.emel ||
    !this.details.skimPerkhidmatan ||
    !this.details.gredHakiki||
    !this.details.namaJawatan ||
    !this.details.gredDisandang||
    !this.details.idUnit || 
    !this.details.tarikhMulaKontrak ||
    !this.details.tarikhAkhirKontrak
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Maklumat tidak lengkap!',
      text: 'Sila lengkapkan semua maklumat.',
      confirmButtonText: 'OK'
    });
    return;
  }

  this.details.isActive = false;

  const payload = {
    ...this.details,
    tarikhMulaKontrak: this.details.tarikhMulaKontrak
      ? this.formatDateOnly(this.details.tarikhMulaKontrak)
      : null,
    tarikhAkhirKontrak: this.details.tarikhAkhirKontrak
      ? this.formatDateOnly(this.details.tarikhAkhirKontrak)
      : null
  };

  this.ppsm.simpanPegawaiBaru(payload).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Berjaya!',
        text: 'Pegawai berjaya disimpan.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/senarai-pegawai']);
      });
    },
    error: (err) => {
      console.error('Save error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Ralat!',
        text: 'Gagal menyimpan pegawai. Sila cuba lagi.',
        confirmButtonText: 'OK'
      });
    }
  });
}

onUnitChange(event: any) {
  console.log("Selected Unit ID:", event.value);
  console.log("details.idUnit:", this.details.idUnit);
}

  // Utility to format Date to YYYY-MM-DD
  formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}