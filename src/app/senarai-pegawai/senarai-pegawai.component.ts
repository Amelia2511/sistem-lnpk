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

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, TagModule, Tag, MultiSelectModule, InputTextModule, DropdownModule, HttpClientModule, BreadcrumbModule, RouterModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrls: ['./senarai-pegawai.component.css'],
})

// <<<<<<< HEAD
// export class SenaraiPegawaiComponent implements OnInit{
//   statuses!: any[];
//   employees: Pegawai[] = [];
//   loading: boolean = false;

//   constructor(private pegawaiService: PegawaiService) {}

//   ngOnInit() {
//     this.loadEmployees();
//   }

//   loadEmployees() {
//     this.loading = true;
//     this.pegawaiService.getAllPegawai().subscribe({
//       next: (data) => {
//         this.employees = data;
//         this.loading = false;
//         console.log('Loaded employees:', data);
//       },
//       error: (error) => {
//         console.error('Error loading employees:', error);
//         this.loading = false;
//         // Fallback to dummy data if API fails
//         this.employees = this.getDummyData();
//       }
//     });
//   }

//   getDummyData(): Pegawai[] {
//     // Fallback dummy data in case API is not available
//     return [
//       {
//         id: 1,
//         nama: 'Mas Salwa Alie',
//         noKp: '920315-14-5678',
//         emel: 'mas.salwa@company.gov.my',
//         namaJawatan: 'HR Officer',
//         skimPerkhidmatan: 'Kontrak',
//         gredHakiki: 'S29',
//         gredDisandang: 'S29',
//         kementerian: 'Kementerian Pembangunan Luar Bandar',
//         idBahagian: 'HR001',
//         idUnit: 'UN001',
//         isActive: true,
//         createdAt: '2023-08-12T00:00:00',
//         noFail: 'HR2023001'
//       }
//     ] as Pegawai[];
//   }

//   // Convert Pegawai data to match your existing table structure
//   get products() {
//     return this.employees.map(emp => ({
//       nama: emp.nama,
//       namaJawatan: emp.namaJawatan,
//       noKp: emp.noKp,
//       emel: emp.emel,
//       bahagian: emp.idBahagianNavigation?.namaBahagian || emp.idBahagian,
//       unit: emp.idUnitNavigation?.namaUnit || emp.idUnit,
//       status: emp.isActive ? 'Aktif' : 'Tidak Aktif',
//       buttonOption: emp.isActive ? 'Boleh Dinilai' : 'Aktifkan',
//       skimPerkhidmatan: emp.skimPerkhidmatan,
//       gred: emp.gredHakiki,
//       // Calculate tempoh berkhidmat from createdAt
//       tempohBerkhidmat: this.calculateServicePeriod(emp.createdAt),
//       // Mock contract dates for now
//       tarikhMulaKontrak: new Date(emp.createdAt).toLocaleDateString('ms-MY'),
//       tarikhAkhirKontrak: this.calculateEndDate(emp.createdAt)
//     }));
//   }

//   calculateServicePeriod(startDate: string): string {
//     const start = new Date(startDate);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const years = Math.floor(diffDays / 365);
//     const months = Math.floor((diffDays % 365) / 30);

//     if (years > 0) {
//       return `${years} tahun ${months > 0 ? months + ' bulan' : ''}`;
//     } else {
//       return `${months} bulan`;
//     }
//   }

//   calculateEndDate(startDate: string): string {
//     const start = new Date(startDate);
//     const end = new Date(start);
//     end.setFullYear(start.getFullYear() + 3); // Assuming 3-year contracts
//     return end.toLocaleDateString('ms-MY');
//   }
// }
// =======
export class SenaraiPegawaiComponent implements OnInit {
  products: pegawaiDinilai[] = [];
  pegawai: pegawaiDinilai | undefined;
  loading: boolean = false;
  units: any[] = [];

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
    this.loadUnitsFromAPI();
  }

  // Test function to load units from the API
  loadUnitsFromAPI() {
    console.log('Attempting to load units from API...');
    this.pegawaiService.getAllUnit().subscribe({
      next: (data) => {
        console.log('Units loaded from API:', data);
        this.units = data;
      },
      error: (error) => {
        console.error('Error loading units from API:', error);
      }
    });
  }

  // Test function to load pegawai from API
  loadPegawaiFromAPI() {
    console.log('Attempting to load pegawai from API...');
    this.loading = true;
    this.pegawaiService.getAllPegawai().subscribe({
      next: (data) => {
        console.log('Pegawai loaded from API:', data);
        // Convert API data to match pegawaiDinilai format
        this.products = data.map((p: any) => ({
          noFail: p.noFail || 'N/A',
          kementerian: p.kementerian || 'N/A',
          nama: p.nama,
          noKP: p.noKP,
          emel: p.emel,
          skimPerkhidmatan: p.skimPerkhidmatan,
          gredHakiki: p.gredHakiki,
          namaJawatan: p.namaJawatan || 'N/A',
          gredDisandang: p.gredDisandang,
          tarikhMulaKontrak: undefined,
          tarikhAkhirKontrak: undefined,
          tempatBertugas: undefined,
          idUnit: p.idUnit,
          idBahagian: p.idBahagian,
          isActive: p.isActive,
          status: p.isActive ? 'Aktif' : 'Tidak Aktif',
          buttonOption: p.isActive ? 'Boleh Dinilai' : 'Aktifkan'
        } as pegawaiDinilai));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pegawai from API:', error);
        this.loading = false;
        // Fallback to original method
        this.getPegawaiList();
      }
    });
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
      console.error('Error with PydService, trying API instead:', err);
      // If the original service fails, try the API
      this.loadPegawaiFromAPI();
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
