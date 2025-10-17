import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { markahSoalan } from '../model/markah-soalan.model';
import Swal from 'sweetalert2';
import { MarkahSoalanService } from '../services/markah-soalan.service';
import { RoleStateService } from '../services/role-state.service';
import { CommonModule } from '@angular/common';
import { PenilaianService } from '../services/penilaian.service';
import { markahKeseluruhan } from '../model/markah-keseluruhan.model';

@Component({
  selector: 'app-penilaian-ppk',
  imports: [CommonModule, ButtonModule, FormsModule, TableModule, InputNumberModule, DividerModule],
  templateUrl: './penilaian-ppk.component.html',
  styleUrl: './penilaian-ppk.component.css'
})

export class PenilaianPpkComponent implements OnInit {

  // === Add these at the top of your class ===
  loading: boolean = false;
  marks: any[] = [];
  totalMarkah: number = 0;

  // === Add these functions ===
  // loadMarkahFromDb(idPenilaian: number) {
  //   this.loading = true;
  //   this.penilaianService.getMarkahSoalan(idPenilaian).subscribe({
  //     next: (res) => {
  //       console.log('Markah loaded:', res);
  //       this.marks = res || [];
  //       this.calculateTotal();
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading markah:', err);
  //       this.loading = false;
  //     }
  //   });
  // }

  calculateTotal() {
    this.totalMarkah = this.marks.reduce((sum, m) => sum + (m.markahPPK || 0), 0);
  }

  onMarkChange() {
    this.calculateTotal();
  }

  a1 = 1;

  // Data for the Skala table
  skalaData = [
    { level: 'Scale Values', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
  ];

  details: markahSoalan = {} as markahSoalan;
  markah: string | null = null;
  products: any[] = [];
  markahSoalanList: markahSoalan[] = [];

  // Add these properties for the evaluation context
  idPenilaian: number | null = null;
  evaluatorType: string = 'self';
  isLoadingMarks: boolean = false;

  // Testing mode
  testMode: boolean = false; // Set to false when you have real data
  mockIdPenilaian: number = 1; // Mock ID for testing

  formValues = {
    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 1 
    ilmuPengetahuan: null as number | null,
    kuantitiHasil: null as number | null,
    kualitiHasil: null as number | null,
    penganalisisan: null as number | null,
    nilaiTambah: null as number | null,

    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 2 
    ilmuPengetahuan2: null as number | null,
    kuantitiHasil2: null as number | null,
    kualitiHasil2: null as number | null,
    penganalisisan2: null as number | null,
    nilaiTambah2: null as number | null,

    // Kualiti Peribadi - Column 1 
    integriti: null as number | null,
    disiplin: null as number | null,
    kepimpinan: null as number | null,
    kreatifProaktif: null as number | null,
    kawalanDiri: null as number | null,
    jalinanHubungan: null as number | null,

    // Kualiti Peribadi - Column 2 
    integriti2: null as number | null,
    disiplin2: null as number | null,
    kepimpinan2: null as number | null,
    kreatifProaktif2: null as number | null,
    kawalanDiri2: null as number | null,
    jalinanHubungan2: null as number | null
  };

  markahKeseluruhan: number = 0;
  markahKeseluruhan2: number = 0;

  constructor(
    private router: Router,
    private markahSoalan: MarkahSoalanService,
    private roleState: RoleStateService,
    private penilaianService: PenilaianService
  ) { }

  ngOnInit(): void {
    // Get saved idPenilaian from localStorage (set by previous screen)
    this.idPenilaian = this.penilaianService.getSavedIdPenilaian();
    if (this.idPenilaian) {
      this.loadMarkahFromDb(this.idPenilaian);
    } else {
      Swal.fire('No Penilaian ID found', 'Please select a Penilaian first.', 'warning');
    }
  }

  loadMarkahFromDb(idPenilaian: number) {
    this.loading = true;
    this.markahSoalan.getMarkahSoalanByPenilaian(idPenilaian).subscribe({
      next: (res) => {
        console.log('Markah loaded:', res);
        this.marks = res || [];
        this.mapMarkahToFormValues();
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading markah:', err);
        Swal.fire('Error', 'Failed to load marks from database', 'error');
        this.loading = false;
      }
    });
  }

  mapMarkahToFormValues() {
    // Reset PPP fields first
    this.formValues.ilmuPengetahuan = null;
    this.formValues.kuantitiHasil = null;
    this.formValues.kualitiHasil = null;
    this.formValues.penganalisisan = null;
    this.formValues.nilaiTambah = null;
    this.formValues.integriti = null;
    this.formValues.disiplin = null;
    this.formValues.kepimpinan = null;
    this.formValues.kreatifProaktif = null;
    this.formValues.kawalanDiri = null;
    this.formValues.jalinanHubungan = null;

    for (const mark of this.marks) {
      switch (mark.idSoalan) {
        case 1: this.formValues.ilmuPengetahuan = mark.markah; break;
        case 2: this.formValues.kuantitiHasil = mark.markah; break;
        case 3: this.formValues.kualitiHasil = mark.markah; break;
        case 4: this.formValues.penganalisisan = mark.markah; break;
        case 5: this.formValues.nilaiTambah = mark.markah; break;
        case 6: this.formValues.integriti = mark.markah; break;
        case 7: this.formValues.disiplin = mark.markah; break;
        case 8: this.formValues.kepimpinan = mark.markah; break;
        case 9: this.formValues.kreatifProaktif = mark.markah; break;
        case 10: this.formValues.kawalanDiri = mark.markah; break;
        case 11: this.formValues.jalinanHubungan = mark.markah; break;
        default: console.warn('Unknown idSoalan:', mark.idSoalan);
      }
    }

    // After mapping, calculate percentage (PPP)
    this.calculateMarkahKeseluruhan(); // uses updated function below
  }

  // Load existing marks from database
  // loadExistingMarks(idPenilaian: number): void {
  //   this.isLoadingMarks = true;

  //   if (!this.idPenilaian) {
  //     console.error("idPenilaian is null or undefined");
  //     return;
  //   }

  //   this.penilaianService.getPppMarkahSoalanByPpkPenilaian(this.idPenilaian)
  //     .subscribe({
  //       next: (res) => {
  //         this.markahSoalanList = res;

  //         // Separate self-evaluation and supervisor evaluation
  //         const selfMarks = res.filter(x => x.idSoalan! <= 11);
  //         const supervisorMarks = res.filter(x => x.idSoalan! > 11);

  //         this.mapMarksToForm(selfMarks, false);
  //         this.mapMarksToForm(supervisorMarks, true);

  //         this.calculateMarkahKeseluruhan();
  //         this.isLoadingMarks = false;
  //       },
  //       error: (err) => {
  //         console.error("Error loading marks:", err);
  //         this.isLoadingMarks = false;
  //       }
  //     });
  // }

  // Map marks from database to form values
  // mapMarksToForm(marks: any[], isSupervisor: boolean): void {
  //   marks.forEach(mark => {
  //     const soalanId = isSupervisor ? mark.idSoalan - 100 : mark.idSoalan;
  //     const suffix = isSupervisor ? '2' : '';

  //     switch (soalanId) {
  //       case 1:
  //         this.formValues[`ilmuPengetahuan${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 2:
  //         this.formValues[`kuantitiHasil${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 3:
  //         this.formValues[`kualitiHasil${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 4:
  //         this.formValues[`penganalisisan${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 5:
  //         this.formValues[`nilaiTambah${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 6:
  //         this.formValues[`integriti${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 7:
  //         this.formValues[`disiplin${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 8:
  //         this.formValues[`kepimpinan${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 9:
  //         this.formValues[`kreatifProaktif${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 10:
  //         this.formValues[`kawalanDiri${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //       case 11:
  //         this.formValues[`jalinanHubungan${suffix}` as keyof typeof this.formValues] = mark.markah;
  //         break;
  //     }
  //   });
  // }

  // Calculate overall percentage whenever any input changes
  calculateMarkahKeseluruhan(): void {
    // Column 1 calculation 
    const column1Values = [
      this.formValues.ilmuPengetahuan,
      this.formValues.kuantitiHasil,
      this.formValues.kualitiHasil,
      this.formValues.penganalisisan,
      this.formValues.nilaiTambah,
      this.formValues.integriti,
      this.formValues.disiplin,
      this.formValues.kepimpinan,
      this.formValues.kreatifProaktif,
      this.formValues.kawalanDiri,
      this.formValues.jalinanHubungan
    ].filter(val => val !== null) as number[];

    // Column 2 calculation
    const column2Values = [
      this.formValues.ilmuPengetahuan2,
      this.formValues.kuantitiHasil2,
      this.formValues.kualitiHasil2,
      this.formValues.penganalisisan2,
      this.formValues.nilaiTambah2,
      this.formValues.integriti2,
      this.formValues.disiplin2,
      this.formValues.kepimpinan2,
      this.formValues.kreatifProaktif2,
      this.formValues.kawalanDiri2,
      this.formValues.jalinanHubungan2
    ].filter(val => val !== null) as number[];

    // Calculate Column 1 percentage
    if (column1Values.length === 0) {
      this.markahKeseluruhan = 0;
    } else {
      const total1 = column1Values.reduce((sum, val) => sum + val, 0);
      const average1 = total1 / column1Values.length;
      this.markahKeseluruhan = (average1 / 10) * 100;
    }

    // Calculate Column 2 percentage
    if (column2Values.length === 0) {
      this.markahKeseluruhan2 = 0;
    } else {
      const total2 = column2Values.reduce((sum, val) => sum + val, 0);
      const average2 = total2 / column2Values.length;
      this.markahKeseluruhan2 = (average2 / 10) * 100;
    }
  }

  // Method to handle input changes
  onInputChange(): void {
    this.calculateMarkahKeseluruhan();
  }

  simpan(): void {
    if (!this.idPenilaian) {
      Swal.fire({
        icon: 'error',
        title: 'Ralat!',
        text: 'ID Penilaian tidak ditemukan. Sila cuba lagi.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const records: any[] = [];

    // Define criteria with their corresponding idSoalan (1–11)
    const criteria = [
      { id: 1, name: 'ilmuPengetahuan', col2: this.formValues.ilmuPengetahuan2 },
      { id: 2, name: 'kuantitiHasil', col2: this.formValues.kuantitiHasil2 },
      { id: 3, name: 'kualitiHasil', col2: this.formValues.kualitiHasil2 },
      { id: 4, name: 'penganalisisan', col2: this.formValues.penganalisisan2 },
      { id: 5, name: 'nilaiTambah', col2: this.formValues.nilaiTambah2 },
      { id: 6, name: 'integriti', col2: this.formValues.integriti2 },
      { id: 7, name: 'disiplin', col2: this.formValues.disiplin2 },
      { id: 8, name: 'kepimpinan', col2: this.formValues.kepimpinan2 },
      { id: 9, name: 'kreatifProaktif', col2: this.formValues.kreatifProaktif2 },
      { id: 10, name: 'kawalanDiri', col2: this.formValues.kawalanDiri2 },
      { id: 11, name: 'jalinanHubungan', col2: this.formValues.jalinanHubungan2 }
    ];

    const currentTimestamp = new Date().toISOString();

    // Push only PPK marks (col2)
    criteria.forEach((criterion) => {
      if (criterion.col2 !== null && criterion.col2 !== undefined) {
        records.push({
          idPenilaian: this.idPenilaian,
          idSoalan: criterion.id, // PPK uses same idSoalan (1–11)
          markah: criterion.col2,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        });
      }
    });

    console.log('PPK records to save:', records);

    if (records.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Amaran',
        text: 'Tiada markah untuk disimpan.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Save to backend
    this.markahSoalan.simpanMultipleMarkahSoalan(records).subscribe({
      next: (info) => {
        console.log("API response:", info);
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: `${records.length} rekod markah PPK berjaya disimpan.`,
          confirmButtonText: 'OK'
        }).then(() => {
          if (this.idPenilaian) {
            this.loadMarkahFromDb(this.idPenilaian);
          }
        });
      },
      error: (err) => {
        console.error('Save error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: 'Gagal menyimpan markah PPK. Sila cuba lagi.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }

  // TESTING METHODS - Remove these when going to production

  // Load mock data for testing UI without API
  // Assume formValues is what your template uses for *ngFor
  // formValues: { markah: number | null; idSoalan: number }[] = [];

  // loadMockMarks() {
  //   const mockSelfMarks = [
  //     { idSoalan: 1, markah: 5 },
  //     { idSoalan: 2, markah: 3 },
  //     { idSoalan: 3, markah: 4 },
  //   ];

  //   // Set mock marks to formValues object
  //   this.formValues.ilmuPengetahuan = mockSelfMarks.find(m => m.idSoalan === 1)?.markah ?? null;
  //   this.formValues.kuantitiHasil = mockSelfMarks.find(m => m.idSoalan === 2)?.markah ?? null;
  //   this.formValues.kualitiHasil = mockSelfMarks.find(m => m.idSoalan === 3)?.markah ?? null;
  //   // Set other fields to null for testing
  //   this.formValues.penganalisisan = null;
  //   this.formValues.nilaiTambah = null;
  //   this.formValues.ilmuPengetahuan2 = null;
  //   this.formValues.kuantitiHasil2 = null;
  //   this.formValues.kualitiHasil2 = null;
  //   this.formValues.penganalisisan2 = null;
  //   this.formValues.nilaiTambah2 = null;
  //   this.formValues.integriti = null;
  //   this.formValues.disiplin = null;
  //   this.formValues.kepimpinan = null;
  //   this.formValues.kreatifProaktif = null;
  //   this.formValues.kawalanDiri = null;
  //   this.formValues.jalinanHubungan = null;
  //   this.formValues.integriti2 = null;
  //   this.formValues.disiplin2 = null;
  //   this.formValues.kepimpinan2 = null;
  //   this.formValues.kreatifProaktif2 = null;
  //   this.formValues.kawalanDiri2 = null;
  //   this.formValues.jalinanHubungan2 = null;
  // }

  // // Method to manually set idPenilaian for testing
  // setTestIdPenilaian(id: number): void {
  //   console.log('Setting test idPenilaian:', id);
  //   this.idPenilaian = id;
  //   this.mockIdPenilaian = id;
  // }

  // // Method to clear all marks for testing
  // clearAllMarks(): void {
  //   console.log('Clearing all marks...');
  //   Object.keys(this.formValues).forEach(key => {
  //     (this.formValues as any)[key] = null;
  //   });
  //   this.calculateMarkahKeseluruhan();
  //   console.log('All marks cleared');
  // }

  // // Method to switch between test and production mode
  // toggleTestMode(): void {
  //   this.testMode = !this.testMode;
  //   console.log('Test mode:', this.testMode ? 'ON' : 'OFF');
  //   if (this.testMode) {
  //     this.loadMockMarks();
  //   } else {
  //     this.clearAllMarks();
  //   }
  // }

  // // Method to test API call with current mockIdPenilaian
  // testApiCall(): void {
  //   if (!this.mockIdPenilaian) {
  //     console.error('No mockIdPenilaian set');
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Test Error',
  //       text: 'Please set a mock idPenilaian first',
  //       confirmButtonText: 'OK'
  //     });
  //     return;
  //   }

  //   console.log('Testing API call with idPenilaian:', this.mockIdPenilaian);
  //   this.loadExistingMarks(this.mockIdPenilaian);
  // }
}