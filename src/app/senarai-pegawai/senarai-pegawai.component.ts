import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [ButtonModule, DatePickerModule, TagModule, RouterModule, TableModule, BreadcrumbModule, DialogModule, SelectModule, FormsModule, OverlayPanelModule],
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
      this.products = data.map(p => ({
        ...p,
        status: p.isActive ? 'Aktif' : 'Tidak Aktif',
        buttonOption: p.isActive ? 'Boleh Dinilai' : 'Aktifkan'
      }));
    },
    error: (err) => {
      console.error(err);
    }
  });
}

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
}