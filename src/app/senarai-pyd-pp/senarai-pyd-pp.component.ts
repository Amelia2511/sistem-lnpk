import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PydService } from '../services/pyd.service';
import { PenilaianService } from '../services/penilaian.service';
import { AuthService } from '../auth/auth.service';
import { RoleStateService } from '../services/role-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { pegawaiDinilai } from '../model/pegawai.model';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { unit } from '../model/unit.model';
import { PpsmService } from '../services/ppsm.service';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-senarai-pyd-pp',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, SelectModule, PaginatorModule, TagModule, DialogModule, FormsModule, BreadcrumbModule],
  templateUrl: './senarai-pyd-pp.component.html',
  styleUrls: ['./senarai-pyd-pp.component.css']
})
export class SenaraiPydPpComponent implements OnInit {
  units: unit[] = [];
  products: pegawaiDinilai[] = [];
  allProducts: pegawaiDinilai[] = [];
  details: pegawaiDinilai = {} as pegawaiDinilai;
  pegawai: pegawaiDinilai | undefined;
  display: boolean = false;
  selectedPegawai: pegawaiDinilai | undefined;
  selectedUnitId: number | null = null;

  // PP info - get from your auth/session service
  currentPpNoKp: string = ''; // Should be retrieved from your auth service

  tahunPenilaian: number | null = null;
  kategoriPenilaian: number | null = null;

  tahunOptions: { label: string; value: number }[] = [];
  kategoriOptions = [
    { label: 'Utama', value: 1 },
    { label: 'Semula', value: 2 },
  ];

  items: MenuItem[] = [
    { label: 'Senarai', routerLink: '/senarai-pyd-pp' },
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

  constructor(
    private pydService: PydService,
    private penilaianService: PenilaianService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ppsm: PpsmService,
    private roleState: RoleStateService
  ) { }

  ngOnInit() {
    this.initTahunOptions();

    // Subscribe to current user from authService
    this.authService.currentUser.subscribe((user: any) => {
      if (user && user.noKP) {
        this.currentPpNoKp = user.noKP;
        console.log("Current PP NoKp:", this.currentPpNoKp);

        // Load units first, then load PYD list
        this.ppsm.getUnit().subscribe(res => {
          this.units = res;
          this.getPegawaiListForPp();
        });
      } else {
        console.warn("No user or noKP found in authService.");
        Swal.fire({
          icon: 'warning',
          title: 'Amaran',
          text: 'Maklumat pengguna tidak dijumpai. Sila log masuk semula.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  initTahunOptions() {
    const currentYear = new Date().getFullYear();
    this.tahunOptions = Array.from({ length: 5 }, (_, i) => {
      const y = currentYear + i;
      return { label: y.toString(), value: y };
    });
  }

  getPegawaiListForPp() {
    // Validate that we have the PP's NoKP
    if (!this.currentPpNoKp) {
      console.error('Current PP NoKP is not available');
      Swal.fire({
        icon: 'error',
        title: 'Ralat!',
        text: 'Maklumat pengguna tidak dijumpai. Sila log masuk semula.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Use the existing getMaklumatPyd endpoint which returns all PYD for a PP
    this.pydService.getMaklumatPyd(this.currentPpNoKp).subscribe({
      next: (pydList: any) => {
        console.log(`Found ${Array.isArray(pydList) ? pydList.length : 1} PYD linked to this PP`);

        // Handle both single object and array response
        const pydArray = Array.isArray(pydList) ? pydList : [pydList];

        this.allProducts = pydArray.map((p: any) => {
          const unitName = p.namaUnit || this.units.find(u => u.id === p.idUnit)?.namaUnit || '-';
          return {
            ...p,
            id: p.id,
            nama: p.nama,
            noKP: p.noKP,
            emel: p.emel,
            skimPerkhidmatan: p.skimPerkhidmatan,
            gredHakiki: p.gredHakiki,
            gredDisandang: p.gredDisandang,
            namaJawatan: p.namaJawatan,
            tarikhMulaKontrak: p.tarikhMulaKontrak,
            tarikhAkhirKontrak: p.tarikhAkhirKontrak || '-',
            tempohBerkhidmat: p.tempohBerkhidmat || '-',
            idUnit: p.idUnit,
            namaUnit: unitName,
            isActive: p.isActive ?? false,
            status: p.isActive ? 'Aktif' : 'Tidak Aktif',
            buttonOption: p.isActive ? 'Nilai' : 'Aktifkan',
            idPyd: p.id,
            // Add missing required properties with default values
            noFail: p.noFail || '',
            kementerian: p.kementerian || '',
            tempatBertugas: p.tempatBertugas || '',
            namaPPP: p.namaPPP || '',
            idPpp: p.idPpp || 0,
            idSkt: p.idSkt || 0,
            idPenilaian: p.idPenilaian || null,
            tarikhLahir: p.tarikhLahir || '',
            noTelefon: p.noTelefon || '',
            jantina: p.jantina || '',
            bangsa: p.bangsa || '',
            agama: p.agama || '',
            tarafPerkahwinan: p.tarafPerkahwinan || ''
          } as pegawaiDinilai;
        }) as pegawaiDinilai[];

        this.products = [...this.allProducts];
        console.log('PYD list loaded successfully');
      },
      error: (err) => {
        console.error('Error fetching PYD list', err);
        if (err.status === 404) {
          this.allProducts = [];
          this.products = [];
          console.log('No PYD found for this PP');
          Swal.fire({
            icon: 'info',
            title: 'Maklumat',
            text: 'Tiada pegawai yang dinilai dijumpai untuk akaun anda.',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ralat!',
            text: 'Tidak dapat memuat senarai pegawai yang dinilai',
            confirmButtonText: 'OK'
          });
        }
      }
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

  aktifkan(row: pegawaiDinilai) {
    this.selectedPegawai = row;
    this.display = true;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  showDialog() {
    this.display = true;
    this.tahunPenilaian = null;
    this.kategoriPenilaian = null;
  }

  confirmActivation() {
    if (!this.selectedPegawai?.id || this.selectedPegawai.isActive) return;

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
        this.selectedPegawai!.isActive = true;
        this.selectedPegawai!.status = 'Aktif';
        this.selectedPegawai!.buttonOption = 'Nilai';
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
    } else if (product.buttonOption === 'Nilai') {
      this.nilai(product);
    } else {
      console.log('No action available for', product.buttonOption);
    }
  }

  nilai(pegawai: any) {
    this.pydService.nilai(pegawai.id).subscribe({
      next: (res) => {
        pegawai.nilaiClicked = true;

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

  viewMaklumatPyd(pyd: any): void {
    this.roleState.setIdPyd(pyd.idPyd);
    this.pydService.setTahunPenilaian(pyd.tahunPenilaian);
    this.pydService.setKategoriPenilaian(pyd.namaKategoriPenilaian);
    this.router.navigate(['/sasaran-pp']);
  }
}