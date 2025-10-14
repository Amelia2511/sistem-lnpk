import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { unit } from '../model/unit.model';
import { PpsmService } from '../services/ppsm.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [ButtonModule, DatePickerModule, TagModule, RouterModule, TableModule, BreadcrumbModule, DialogModule, SelectModule, FormsModule, PaginatorModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrl: './senarai-pegawai.component.css',
})

export class SenaraiPegawaiComponent implements OnInit {
  openActivationDialog(_t17: any) {
    throw new Error('Method not implemented.');
  }
  units: unit[] = [];
  products: pegawaiDinilai[] = [];
  allProducts: pegawaiDinilai[] = [];
  details: pegawaiDinilai = {} as pegawaiDinilai;
  pegawai: pegawaiDinilai | undefined;
  display: boolean = false;
  selectedPegawai: pegawaiDinilai | undefined;
  selectedUnitId: number | null = null;

  // Form data for the dialog
  tahunPenilaian: number | null = null;
  kategoriPenilaian: number | null = null;


  tahunOptions: { label: string; value: number }[] = [];
  // Map to your real DB IDs
  kategoriOptions = [
    { label: 'Utama', value: 1 },
    { label: 'Semula', value: 2 },
  ];

  items: MenuItem[] = [
    { label: 'Senarai', routerLink: '/senarai-pegawai' },
    { label: 'Tambah Pegawai', routerLink: '/daftar-anggota' }
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  first1: number = 0;

  rows1: number = 5;

  first2: number = 0;

  rows2: number = 5;

  first3: number = 0;

  rows3: number = 5;

  totalRecords: number = 120;

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  onPageChange1(event: PaginatorState) {
    this.first1 = event.first ?? 0;
    this.rows1 = event.rows ?? 10;
  }

  onPageChange2(event: PaginatorState) {
    this.first2 = event.first ?? 0;
    this.rows2 = event.rows ?? 10;
  }

  onPageChange3(event: PaginatorState) {
    this.first3 = event.first ?? 0;
    this.rows3 = event.rows ?? 10;
  }

  constructor(private pydService: PydService, private route: ActivatedRoute, private router: Router, private ppsm: PpsmService) { }

  ngOnInit() {
    this.getPegawaiList();
    this.initTahunOptions();
    this.ppsm.getUnit().subscribe(res => this.units = res);
  }

  initTahunOptions() {
    const currentYear = new Date().getFullYear();
    this.tahunOptions = Array.from({ length: 5 }, (_, i) => {
      const y = currentYear + i;
      return { label: y.toString(), value: y };
    });
  }

  getPegawaiList() {
    this.pydService.getPegawaiDinilai().subscribe({
      next: (data: pegawaiDinilai[]) => {
        this.allProducts = data.map(p => {
          const unitName = this.units.find(u => u.id === p.idUnit)?.namaUnit ?? '-';
          return {
            ...p,
            namaUnit: unitName,
            status: p.isActive ? 'Aktif' : 'Tidak Aktif',
            buttonOption: p.isActive ? 'Boleh Dinilai' : 'Aktifkan',
            tempohBerkhidmat: this.calculateDuration(
              p.tarikhMulaKontrak instanceof Date ? p.tarikhMulaKontrak.toISOString().slice(0, 10) : p.tarikhMulaKontrak,
              p.tarikhAkhirKontrak instanceof Date ? p.tarikhAkhirKontrak.toISOString().slice(0, 10) : p.tarikhAkhirKontrak
            )
          };
        });
        this.products = [...this.allProducts];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // getUnitPyd() {
  //   if (typeof this.details.namaUnit === 'string') {
  //     this.pydService.getUnitPyd(this.details.namaUnit).subscribe({
  //       next: (data: pegawaiDinilai) => {
  //         this.products = [data];
  //       },
  //       error: (err) => {
  //         console.error(err);
  //       }
  //     });
  //   } else {
  //     console.error('namaUnit is undefined or not a string');
  //   }
  // }

  onUnitChange(event: any) {
    const unitId = event.value;
    if (unitId) {
      this.products = this.allProducts.filter(p => p.idUnit === unitId);
    } else {
      this.products = [...this.allProducts];}}

// getPegawaiList() {
//   this.pydService.getPegawaiDinilai().subscribe({
//     next: (data: pegawaiDinilai[]) => {
//       console.log('Raw data from backend:', data); // Debug: check what you're getting

//       this.products = data.map(p => ({
//         ...p,
//         status: p.statusPenilaianTerkini || 'Tiada Penilaian',
//         buttonOption: this.getButtonOption(p.statusPenilaianTerkini) // Use the function!
//       }));

//       console.log('Mapped products:', this.products); // Debug: check mapped data
//     },
//     error: (err) => {
//       console.error('Error with PydService:', err);
//     }
//   }

  aktifkan(row: pegawaiDinilai) {
    this.selectedPegawai = row;
    this.display = true;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  showDialog() {
    this.display = true;
    // Reset form values
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }
getButtonOption(status: string | undefined): string {
  if (!status || status === '' || status === null) {
    return 'Aktifkan'; // No evaluation yet - empty status
  }

  if (status === 'Draf' || status === 'Pengesahan PPP') {
    return 'SKT'; // Evaluation in progress
  }

  if (status === 'SKT Selesai') {
    return 'Boleh Dinilai'; // SKT completed, ready for PPSM to activate evaluation
  }

  if (status === 'Penilaian PPP' || status === 'Penilaian PPK' || status === 'Penilaian Selesai') {
    return 'Sedang Dinilai'; // Evaluation in progress
  }

  if (status === 'Penilaian Selesai PPSM') {
    return 'Aktifkan Semula'; // Completed, can start new evaluation
  }

  return 'N/A'; // Default fallback
}

// aktifkan(row: pegawaiDinilai) {
//   this.selectedPegawai = row;
//   this.display = true;
//   this.tahunPenilaian = null;
//   this.kategoriPenilaian = null;
// }

bolehDinilaikan(row: pegawaiDinilai) {
  this.selectedPegawai = row;
  this.display = true;
  this.tahunPenilaian = null;
  this.kategoriPenilaian = null;
}

// showDialog() {
//   this.display = true;
//   // Reset form values
//   this.tahunPenilaian = null;
//   this.kategoriPenilaian = null;
// }

  confirmActivation() {
    console.log('confirmActivation clicked', this.tahunPenilaian, this.kategoriPenilaian, this.selectedPegawai?.id);

    if (!this.selectedPegawai?.id || this.selectedPegawai.isActive) return;

    if (this.tahunPenilaian == null || this.kategoriPenilaian == null) {
      alert('Sila pilih Tahun Penilaian dan Kategori Penilaian');
      return;
    }

    (this.selectedPegawai)._busy = true;

    const payload = {
      tahunPenilaian: Number(this.tahunPenilaian),
      idKategoriPenilaian: Number(this.kategoriPenilaian)
    };

    this.pydService.aktifkanPegawai(this.selectedPegawai.id, payload).subscribe({
      next: () => {
        this.selectedPegawai!.isActive = true;
        this.selectedPegawai!.status = 'Aktif';
        this.selectedPegawai!.buttonOption = 'Boleh Dinilai';
        (this.selectedPegawai as any)._busy = false;

        this.display = false;
        this.selectedPegawai = undefined;
      },
      error: (err) => {
        console.error('Activation failed', err);
        (this.selectedPegawai as any)._busy = false;
      }
    });
  };

  cancelActivation() {
    this.display = false;
    this.selectedPegawai = undefined;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  handleAction(product: any) {
    if (product.buttonOption === 'Aktifkan') {
      this.aktifkan(product);
      this.showDialog();
    }
    // else if (product.buttonOption === 'Boleh Dinilai') {
    //   this.bolehDinilai(product);
    // }
    else {
      console.log('No action available for', product.buttonOption);
    }
  }

  // calculateDuration(startDate: string): string {
  //   if (!startDate) return '-';
  //   const start = new Date(startDate.split('/').reverse().join('-'));
  //   const today = new Date();

  //   let years = today.getFullYear() - start.getFullYear();
  //   let months = today.getMonth() - start.getMonth();

  //   if (months < 0) {
  //     years--;
  //     months += 12;
  //   }

  //   if (years < 0) return '-';

  //   return years > 0
  //     ? `${years} thn ${months} bln`
  //     : `${months} bln`;
  // }

  private parseDate(dateStr?: string | null): Date | null {
    if (!dateStr) return null;

    // dd/MM/yyyy  -> 29/09/2025
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const d = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const y = Number(parts[2]);
        return new Date(y, m, d);
      }
    }

    // yyyy-MM-dd -> 2025-09-29
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      // assume yyyy-mm-dd
      if (parts.length === 3 && parts[0].length === 4) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const d = Number(parts[2]);
        return new Date(y, m, d);
      }
      // fallback: dd-mm-yyyy
      if (parts.length === 3 && parts[2].length === 4) {
        const d = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const y = Number(parts[2]);
        return new Date(y, m, d);
      }
    }

    // Last resort - let JS try
    const dt = new Date(dateStr);
    return isNaN(dt.getTime()) ? null : dt;
  }

  calculateDuration(startStr?: string | null, endStr?: string | null): string {
    const start = this.parseDate(startStr);
    if (!start) return '-';

    const end = this.parseDate(endStr) ?? new Date(); // use end if provided, otherwise today

    // if end < start return 0
    if (end.getTime() < start.getTime()) return '0 hari';

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // if days negative, borrow days from previous month
    if (days < 0) {
      months -= 1;
      // last day of previous month relative to 'end'
      const lastDayPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      days += lastDayPrevMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} thn`);
    if (months > 0) parts.push(`${months} bln`);
    if (days > 0) parts.push(`${days} hari`);
    if (parts.length === 0) return '0 hari';
    return parts.join(' ');
  }

  // bolehDinilai(pegawai: any) {
  //   this.pydService.bolehDinilai(pegawai.id).subscribe({
  //     next: (res) => {
  //       console.log(res.message);
  //       pegawai.bolehDinilaiClicked = true;

  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Berjaya!',
  //         text: res.message,
  //         confirmButtonText: 'OK'
  //       });
  //     },
  //     error: (err) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Ralat!',
  //         text: 'Tidak dapat proses Boleh Dinilai',
  //         confirmButtonText: 'OK'
  //       });
  //     }
  //   });
  // }

handleButtonClick(product: pegawaiDinilai) {
  switch (product.buttonOption) {
    case 'Aktifkan':
    case 'Aktifkan Semula':
      this.aktifkan(product); // Show dialog to create new evaluation
      break;
    case 'Boleh Dinilai':
      this.confirmBolehDinilai(product); // Allow evaluation without dialog
      break;
    case 'Sedang Dinilai':
      // Disabled, do nothing
      break;
  }
}

confirmBolehDinilai(product?: pegawaiDinilai) {
  const pegawai = product || this.selectedPegawai;

  if (!pegawai?.id) return;

  // Since backend already provides latest SKT info, just use it
  if (!pegawai.tahunPenilaianTerkini || !pegawai.kategoriPenilaianTerkini) {
    alert('Maklumat penilaian tidak lengkap. Pegawai ini tidak mempunyai SKT.');
    return;
  }

  const payload = {
    tahunPenilaian: pegawai.tahunPenilaianTerkini,
    idKategoriPenilaian: pegawai.kategoriPenilaianTerkini === "Penilaian Utama" ? 1 : 2
  };

  (pegawai as any)._busy = true;

  if (!pegawai.idSktTerkini) {
    alert('ID SKT tidak dijumpai');
    (pegawai as any)._busy = false;
    return;
  }

  this.pydService.bolehDinilai(pegawai.idSktTerkini, payload).subscribe({
    next: (response) => {
      (pegawai as any)._busy = false;
      console.log(response.message);

      // Update UI to reflect new status
      pegawai.buttonOption = 'Sedang Dinilai';
      // pegawai.status = 'Boleh Dinilai';
    },
    error: (error) => {
      (pegawai as any)._busy = false;
      console.error('Error:', error);
      alert('Gagal membenarkan pegawai dinilai');
    }
  });
}
getKategoriLabel(kategoriId: number | string | undefined): string {
  if (typeof kategoriId === 'string') return kategoriId;

  switch (kategoriId) {
    case 1: return 'Utama';
    case 2: return 'Semula';
    default: return '-';
  }
}
getStatusSeverity(status: string | undefined): string {
  switch (status) {
    case 'SKT Selesai':
      return 'warn'; // Waiting for PPSM action
    case 'Boleh Dinilai':
    case 'Penilaian PPP':
    case 'Penilaian PPK':
      return 'info'; // In progress
    case 'Penilaian Selesai':
    case 'Penilaian Selesai PPSM':
      return 'success'; // Completed
    case 'Tiada Penilaian':
      return 'secondary';
    default:
      return 'secondary';
  }
}

getButtonSeverity(buttonOption: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
  switch (buttonOption) {
    case 'Aktifkan':
    case 'Aktifkan Semula':
      return 'success';
    case 'Benarkan Dinilai':
      return 'info';
    case 'Sedang Dinilai':
      return 'secondary';
    default:
      return 'secondary';
  }}}