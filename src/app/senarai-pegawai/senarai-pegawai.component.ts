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


@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [ButtonModule, TagModule, RouterModule, TableModule, BreadcrumbModule, DialogModule, SelectModule, FormsModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrls: ['./senarai-pegawai.component.css'],
})
export class SenaraiPegawaiComponent implements OnInit {
  products: pegawaiDinilai[] = [];
  pegawai: pegawaiDinilai | undefined;
  display: boolean = false;
  selectedPegawai: pegawaiDinilai | undefined;

  // Form data for the dialog
  tahunPenilaian: number | null = null;
  kategoriPenilaian: string | null = null;

  // Options for the select dropdowns
  tahunOptions: any[] = [];
  kategoriOptions: any[] = [
    { label: 'Utama', value: 'Utama' },
    { label: 'Semula', value: 'Semula' }
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
    this.tahunOptions = [];
    
    // Generate options for current year and next few years
    for (let i = 0; i < 5; i++) {
      const year = currentYear + i;
      this.tahunOptions.push({ label: year.toString(), value: year });
    }
  }

  getPegawaiList() {
  this.pydService.getPegawaiDinilai().subscribe({
    next: (data: pegawaiDinilai[]) => {
      console.log(data)
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
}

showDialog() {
  this.display = true;
  // Reset form values
  this.tahunPenilaian = null;
  this.kategoriPenilaian = null;
}

confirmActivation() {
  if (!this.selectedPegawai?.id || this.selectedPegawai.isActive) return;
  
  if (!this.tahunPenilaian || !this.kategoriPenilaian) {
    alert('Sila pilih Tahun Penilaian dan Kategori Penilaian');
    return;
  }

  // optional: a busy flag if you want to disable the button during request
  (this.selectedPegawai as any)._busy = true;

  // Here you can pass the form data to your service if needed
  console.log('Activating employee with:', {
    tahunPenilaian: this.tahunPenilaian,
    kategoriPenilaian: this.kategoriPenilaian
  });

  this.pydService.aktifkanPegawai(this.selectedPegawai.id).subscribe({
    next: () => {
      if (this.selectedPegawai) {
        this.selectedPegawai.isActive = true;
        this.selectedPegawai.status = 'Aktif';
        this.selectedPegawai.buttonOption = 'Boleh Dinilai';
        (this.selectedPegawai as any)._busy = false;
      }
      this.display = false;
      this.selectedPegawai = undefined;
    },
    error: (err) => {
      console.error('Aktifkan failed', err);
      if (this.selectedPegawai) {
        (this.selectedPegawai as any)._busy = false;
      }
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