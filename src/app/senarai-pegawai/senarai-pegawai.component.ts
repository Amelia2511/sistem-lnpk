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

  // handleButtonClick(product: pegawaiDinilai) {
  //   if (product.buttonOption === 'Aktifkan') {
  //     product.buttonOption = 'Boleh Dinilai';
  //     product.status = 'Aktif';
  //     console.log(product.nama + ' telah diaktifkan');
  //   } else {
  //     product.buttonOption = 'Boleh Dinilai';
  //     product.status = 'Draf';
  //   }
  //   this.products = [...this.products];
  // };
}
