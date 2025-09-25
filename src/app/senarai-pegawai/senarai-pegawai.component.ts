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

@Component({
  selector: 'app-senarai-pegawai',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, TagModule, Tag, MultiSelectModule, InputTextModule, DropdownModule, HttpClientModule, BreadcrumbModule, RouterModule, DatePickerModule, DialogModule, SelectModule, FormsModule],
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
      this.products = data.map(p => ({
        ...p,
        status: p.isActive ? 'Aktif' : 'Tidak Aktif',
        buttonOption: p.isActive ? 'Boleh Dinilai' : 'Aktifkan'
      }));
    },
    error: (err) => {
      console.error('Error with PydService, trying API instead:', err);
      // If the original service fails, try the API
      // this.loadPegawaiFromAPI();
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
