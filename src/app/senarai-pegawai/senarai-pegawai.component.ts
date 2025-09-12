// import { Component, OnInit } from '@angular/core';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { TagModule } from 'primeng/tag';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown';
// import { BreadcrumbModule } from 'primeng/breadcrumb';
// import { MenuItem } from 'primeng/api';
// import { RouterModule, ActivatedRoute } from '@angular/router';
// import { PydService } from '../services/pyd.service';
// import { pegawaiDinilai } from '../model/pegawai.model';

// @Component({
//   selector: 'app-senarai-pegawai',
//   standalone: true,
//   imports: [
//     TableModule,
//     CommonModule,
//     ButtonModule,
//     TagModule,
//     MultiSelectModule,
//     InputTextModule,
//     DropdownModule,
//     BreadcrumbModule,
//     RouterModule
//   ],
//   templateUrl: './senarai-pegawai.component.html',
//   styleUrls: ['./senarai-pegawai.component.css'],
// })
// export class SenaraiPegawaiComponent implements OnInit {
//   statuses!: any[];
//   pegawai: any;

//   items: MenuItem[] = [{label: 'Senarai', routerLink: '/senarai-pegawai' },{ label: 'Form', routerLink: '/daftar-anggota' }];
//   home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

//   products = [
//     {
//       id: 1,
//       nama: 'Mas Salwa Alie',
//       tarikhMulaKontrak: '12 Ogos 2023',
//       tarikhAkhirKontrak: '12 Ogos 2026',
//       tempohBerkhidmat: '2 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//     {
//       id: 2,
//       nama: 'Noor Amelia Mohd Noor',
//       tarikhMulaKontrak: '16 Oktober 2022',
//       tarikhAkhirKontrak: '16 Oktober 2027',
//       tempohBerkhidmat: '3 tahun',
//       status: 'Tidak Aktif',
//       buttonOption: 'Aktifkan'
//     },
//     {
//       id: 3,
//       nama: 'Nur Syahmina Mohd Noorhisham',
//       tarikhMulaKontrak: '20 Oktober 2022',
//       tarikhAkhirKontrak: '20 Oktober 2026',
//       tempohBerkhidmat: '3 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//     {
//       id: 4,
//       nama: 'Mohamad Azim Hasnul Azlan',
//       tarikhMulaKontrak: '9 Julai 2024',
//       tarikhAkhirKontrak: '9 Julai 2026',
//       tempohBerkhidmat: '1 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//     {
//       id: 5,
//       nama: 'Rabia’tul Adawiyah Khairul Azwan',
//       tarikhMulaKontrak: '12 Ogos 2024',
//       tarikhAkhirKontrak: '12 Ogos 2026',
//       tempohBerkhidmat: '1 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//     {
//       id: 6,
//       nama: 'Nur Izzatul Iffah Mazlan',
//       tarikhMulaKontrak: '18 November 2022',
//       tarikhAkhirKontrak: '18 November 2026',
//       tempohBerkhidmat: '3 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//     {
//       id: 7,
//       nama: 'Faris Rassoulli Rizal Wong',
//       tarikhMulaKontrak: '12 Mei 2021',
//       tarikhAkhirKontrak: '12 Mei 2026',
//       tempohBerkhidmat: '4 tahun',
//       status: 'Aktif',
//       buttonOption: 'Boleh Dinilai'
//     },
//   ];

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit() {
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//     if (id) {
//       this.pegawai = this.products.find(p => p.id === id);
//     }
//   }

//   handleButtonClick(product: any) {
//     if (product.buttonOption === 'Aktifkan') {
//       product.buttonOption = 'Boleh Dinilai';
//       product.status = 'Aktif';
//       console.log(product.nama + ' telah diaktifkan');
//     } else {
//       product.buttonOption = 'Boleh Dinilai';
//       product.status = 'Draf';
//     }
//   };
// }

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
