import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PegawaiService, Pegawai } from '../services/pegawai.service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, TagModule, Tag, MultiSelectModule, InputTextModule, DropdownModule, HttpClientModule, BreadcrumbModule, RouterModule, DatePickerModule, DialogModule, SelectModule, FormsModule, OverlayPanelModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrls: ['./senarai-pegawai.component.css'],
})

export class SenaraiPegawaiComponent implements OnInit {
openActivationDialog(_t17: any) {
throw new Error('Method not implemented.');
}
  products: pegawaiDinilai[] = [];
  pegawai: pegawaiDinilai | undefined;
  display: boolean = false;
  selectedPegawai: pegawaiDinilai | undefined;

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

  constructor(
    private pydService: PydService,
    private pegawaiService: PegawaiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getPegawaiList();
    this.initTahunOptions();
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
      console.log('Raw data from backend:', data); // Debug: check what you're getting

      this.products = data.map(p => ({
        ...p,
        status: p.statusPenilaianTerkini || 'Tiada Penilaian',
        buttonOption: this.getButtonOption(p.statusPenilaianTerkini) // Use the function!
      }));

      console.log('Mapped products:', this.products); // Debug: check mapped data
    },
    error: (err) => {
      console.error('Error with PydService:', err);
    }
  });
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

  return 'Sedang Dinilai'; // Default fallback
}

aktifkan(row: pegawaiDinilai) {
  this.selectedPegawai = row;
  this.display = true;
  this.tahunPenilaian = null;
  this.kategoriPenilaian = null;
}

bolehDinilaikan(row: pegawaiDinilai) {
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
  }

  cancelActivation() {
    this.display = false;
    this.selectedPegawai = undefined;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

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
  }
}
}
