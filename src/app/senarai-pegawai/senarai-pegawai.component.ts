import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [ButtonModule, TagModule, RouterModule, TableModule, BreadcrumbModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrls: ['./senarai-pegawai.component.css'],
})
export class SenaraiPegawaiComponent implements OnInit {
  products: pegawaiDinilai[] = [];
  pegawai: pegawaiDinilai | undefined;

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
  if (!row?.id || row.isActive) return;
  // optional: a busy flag if you want to disable the button during request
  (row as any)._busy = true;

  this.pydService.aktifkanPegawai(row.id).subscribe({
    next: () => {
      row.isActive = true;
      row.status = 'Aktif';
      row.buttonOption = 'Boleh Dinilai';
      (row as any)._busy = false;
    },
    error: (err) => {
      console.error('Aktifkan failed', err);
      (row as any)._busy = false;
    }
  });

// Optionally, refresh the list after activation by calling this.getPegawaiList();
// this.getPegawaiList();

}

}