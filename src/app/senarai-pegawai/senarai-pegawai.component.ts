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
  styleUrls: ['./senarai-pegawai.component.css'],
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
            buttonOption: p.isActive ? 'Boleh Dinilai' : 'Aktifkan'
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
      this.products = [...this.allProducts];
    }
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

  handleAction(product: any) {
    if (product.buttonOption === 'Aktifkan') {
      this.aktifkan(product);
      this.showDialog();
    }
    else if (product.buttonOption === 'Boleh Dinilai') {
      this.bolehDinilai(product);
    }
    else {
      console.log('No action available for', product.buttonOption);
    }
  }

  bolehDinilai(pegawai: any) {
    this.pydService.bolehDinilai(pegawai.id).subscribe({
      next: (res) => {
        console.log(res.message);
        pegawai.bolehDinilaiClicked = true;

        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: res.message,
          confirmButtonText: 'OK'
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: 'Tidak dapat proses Boleh Dinilai',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}