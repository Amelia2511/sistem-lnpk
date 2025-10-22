import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { unit } from '../model/unit.model';
import { PpsmService } from '../services/ppsm.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [
    ButtonModule,
    DatePickerModule,
    TagModule,
    RouterModule,
    TableModule,
    BreadcrumbModule,
    DialogModule,
    SelectModule,
    FormsModule,
    PaginatorModule,
    CommonModule
  ],
  templateUrl: './senarai-pegawai.component.html',
  styleUrl: './senarai-pegawai.component.css',
})
export class SenaraiPegawaiComponent implements OnInit {
  units: unit[] = [];
  products: pegawaiDinilai[] = [];
  allProducts: pegawaiDinilai[] = [];
  details: pegawaiDinilai = {} as pegawaiDinilai;
  display: boolean = false;
  selectedPegawai: pegawaiDinilai | undefined;
  selectedUnitId: number | null = null;

  // Form data for the dialog
  tahunPenilaian: number | null = null;
  kategoriPenilaian: number | null = null;

  tahunOptions: { label: string; value: number }[] = [];
  kategoriOptions = [
    { label: 'Utama', value: 1 },
    { label: 'Semula', value: 2 },
  ];

  items: MenuItem[] = [
    { label: 'Senarai', routerLink: '/senarai-pegawai' },
    { label: 'Tambah Pegawai', routerLink: '/daftar-anggota' }
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  first2: number = 0;
  rows2: number = 5;

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  constructor(
    private pydService: PydService,
    private route: ActivatedRoute,
    private router: Router,
    private ppsm: PpsmService
  ) { }

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

  onUnitChange(event: any) {
    const unitId = event.value;
    if (unitId) {
      this.products = this.allProducts.filter(p => p.idUnit === unitId);
    } else {
      this.products = [...this.allProducts];
    }
  }

  onPageChange2(event: PaginatorState) {
    this.first2 = event.first ?? 0;
    this.rows2 = event.rows ?? 10;
  }

  getPegawaiList() {
    this.pydService.getPegawaiDinilai().subscribe({
      next: (data: pegawaiDinilai[]) => {
        console.log('Raw data from backend:', data);

        this.allProducts = data.map(p => ({
          ...p,
          status: p.statusPenilaianTerkini || 'Tiada Penilaian',
          buttonOption: this.getButtonOption(p.statusPenilaianTerkini),
          tempohBerkhidmat: this.calculateDuration(p.tarikhMulaKontrak, p.tarikhAkhirKontrak)
        }));

        this.products = [...this.allProducts];
        console.log('Mapped products:', this.products);
      },
      error: (err) => {
        console.error('Error with PydService:', err);
      }
    });
  }

  getButtonOption(status: string | undefined): string {
    if (!status || status === '' || status === null) {
      return 'Aktifkan';
    }

    if (status === 'Draf' || status === 'Pengesahan PPP') {
      return 'SKT';
    }

    if (status === 'SKT Selesai') {
      return 'Boleh Dinilai';
    }

    if (status === 'Penilaian PPP' || status === 'Penilaian PPK' || status === 'Penilaian Selesai') {
      return 'Sedang Dinilai';
    }

    if (status === 'Penilaian Selesai PPSM') {
      return 'Aktifkan Semula';
    }

    return 'N/A';
  }

  private normalizeDate(input?: Date | string | null): Date | null {
    if (!input) return null;

    // Already a Date object
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }

    // It's a string, parse it
    return this.parseDate(input);
  }

  private parseDate(dateStr: string): Date | null {
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
      if (parts.length === 3 && parts[0].length === 4) {
        const y = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const d = Number(parts[2]);
        return new Date(y, m, d);
      }
      if (parts.length === 3 && parts[2].length === 4) {
        const d = Number(parts[0]);
        const m = Number(parts[1]) - 1;
        const y = Number(parts[2]);
        return new Date(y, m, d);
      }
    }

    const dt = new Date(dateStr);
    return isNaN(dt.getTime()) ? null : dt;
  }

  calculateDuration(start?: Date | string | null, end?: Date | string | null): string {
    const startDate = this.normalizeDate(start);
    if (!startDate) return '-';

    const endDate = this.normalizeDate(end) ?? new Date();

    if (endDate.getTime() < startDate.getTime()) return '0 hari';

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const lastDayPrevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
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

  handleButtonClick(product: pegawaiDinilai) {
    switch (product.buttonOption) {
      case 'Aktifkan':
      case 'Aktifkan Semula':
        this.aktifkan(product);
        break;
      case 'Boleh Dinilai':
        this.confirmBolehDinilai(product);
        break;
      case 'Sedang Dinilai':
      case 'SKT':
        // Disabled, do nothing
        break;
    }
  }

  aktifkan(row: pegawaiDinilai) {
    this.selectedPegawai = row;
    this.display = true;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  confirmActivation() {
    console.log('confirmActivation clicked', this.tahunPenilaian, this.kategoriPenilaian, this.selectedPegawai?.id);

    if (!this.selectedPegawai?.id) return;

    if (this.tahunPenilaian == null || this.kategoriPenilaian == null) {
      alert('Sila pilih Tahun Penilaian dan Kategori Penilaian');
      return;
    }

    (this.selectedPegawai as any)._busy = true;

    const payload = {
      tahunPenilaian: Number(this.tahunPenilaian),
      idKategoriPenilaian: Number(this.kategoriPenilaian)
    };

    this.pydService.aktifkanPegawai(this.selectedPegawai.id, payload).subscribe({
      next: () => {
        this.selectedPegawai!.status = 'Aktif';
        this.selectedPegawai!.buttonOption = 'SKT';
        (this.selectedPegawai as any)._busy = false;

        this.display = false;
        this.selectedPegawai = undefined;

        // Refresh list
        this.getPegawaiList();
      },
      error: (err) => {
        console.error('Activation failed', err);
        (this.selectedPegawai as any)._busy = false;
        alert('Gagal mengaktifkan pegawai');
      }
    });
  }

  cancelActivation() {
    this.display = false;
    this.selectedPegawai = undefined;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  confirmBolehDinilai(product?: pegawaiDinilai) {
    const pegawai = product || this.selectedPegawai;

    if (!pegawai?.id) return;

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

        pegawai.buttonOption = 'Sedang Dinilai';
        // pegawai.status = 'Penilaian PPP';

        // Refresh list
        // this.getPegawaiList();
      },
      error: (error) => {
        (pegawai as any)._busy = false;
        console.error('Error:', error);
        alert('Gagal membenarkan pegawai dinilai');
      }
    });
    this.pydService.bolehDinilaiPpk(pegawai.idSktTerkini, payload).subscribe({
      next: (response) => {
        (pegawai as any)._busy = false;
        console.log(response.message);

        pegawai.buttonOption = 'Sedang Dinilai';
        // pegawai.status = 'Penilaian PPK';

        // Refresh list
        // this.getPegawaiList();
      },
      error: (error) => {
        (pegawai as any)._busy = false;
        console.error('Error:', error);
        alert('Gagal membenarkan pegawai dinilai');
      }
    });
  }

  getStatusSeverity(status: string | undefined): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (status) {
      case 'Aktif':
        return 'success';
      case 'Draf':
      case 'Pengesahan PPP':
        return 'secondary';
      case 'SKT Selesai':
        return 'warn';
      case 'Boleh Dinilai':
      case 'Penilaian PPP':
      case 'Penilaian PPK':
        return 'info';
      case 'Penilaian Selesai':
      case 'Penilaian Selesai PPSM':
        return 'success';
      case 'Tiada Penilaian':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getButtonSeverity(buttonOption: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    switch (buttonOption) {
      case 'Aktifkan':
      case 'Aktifkan Semula':
        return 'success';
      case 'Boleh Dinilai':
        return 'info';
      case 'Sedang Dinilai':
      case 'SKT':
        return 'secondary';
      default:
        return 'secondary';
    }
  }
}
