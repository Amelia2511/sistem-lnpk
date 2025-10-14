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
  a1 = 1;

  // Data for the Skala table
  skalaData = [
    { level: 'Scale Values', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
  ];

  details: markahSoalan = {} as markahSoalan;
  markah: string | null = null;
  products: any[] = [];

  // Add these properties for the evaluation context
  idPenilaian: number | null = null;
  evaluatorType: string = 'self';
  isLoadingMarks: boolean = false;
  
  // Testing mode
  testMode: boolean = true; // Set to false when you have real data
  mockIdPenilaian: number = 1; // Mock ID for testing

  formValues = {
    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 1 (Self Evaluation)
    ilmuPengetahuan: null as number | null,
    kuantitiHasil: null as number | null,
    kualitiHasil: null as number | null,
    penganalisisan: null as number | null,
    nilaiTambah: null as number | null,

    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 2 (Supervisor Evaluation)
    ilmuPengetahuan2: null as number | null,
    kuantitiHasil2: null as number | null,
    kualitiHasil2: null as number | null,
    penganalisisan2: null as number | null,
    nilaiTambah2: null as number | null,

    // Kualiti Peribadi - Column 1 (Self Evaluation)
    integriti: null as number | null,
    disiplin: null as number | null,
    kepimpinan: null as number | null,
    kreatifProaktif: null as number | null,
    kawalanDiri: null as number | null,
    jalinanHubungan: null as number | null,

    // Kualiti Peribadi - Column 2 (Supervisor Evaluation)
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
    // Test mode: Use mock idPenilaian
    if (this.testMode) {
      console.log('TEST MODE: Using mock idPenilaian:', this.mockIdPenilaian);
      this.idPenilaian = this.mockIdPenilaian;
      this.loadMockMarks(); // Load mock data for testing
      // Uncomment below to test real API in test mode
      this.loadExistingMarks(this.mockIdPenilaian);
    } else {
      // Production mode: Use real idPenilaian from service
      this.penilaianService.idPenilaian$.subscribe(id => {
        if (id !== null) {
          this.idPenilaian = id;
          this.loadExistingMarks(id);
        }
      });
    }

    if (this.markah) {
      this.markahSoalan.getMarkahSoalan(this.markah).subscribe({
        next: (info) => {
          console.log("API response:", info);
          this.products = info;
        },
        error: (error) => {
          console.error("API Error:", error);
        }
      });
    }
  }

  // Load existing marks from database
  loadExistingMarks(idPenilaian: number): void {
    this.isLoadingMarks = true;
    
    this.penilaianService.getMarkahByPenilaian(idPenilaian).subscribe({
      next: (response) => {
        console.log("Loaded marks:", response);
        
        // Map self evaluation marks (idSoalan 1-11)
        const selfMarks = response.selfEvaluation || [];
        this.mapMarksToForm(selfMarks, false);
        
        // Map supervisor evaluation marks (idSoalan 101-111)
        const supervisorMarks = response.supervisorEvaluation || [];
        this.mapMarksToForm(supervisorMarks, true);
        
        // Recalculate totals
        this.calculateMarkahKeseluruhan();
        this.isLoadingMarks = false;
      },
      error: (error) => {
        console.error("Error loading marks:", error);
        if (error.status !== 404) {
          Swal.fire({
            icon: 'warning',
            title: 'Amaran',
            text: 'Gagal memuatkan markah sedia ada. Anda boleh memasukkan markah baru.',
            confirmButtonText: 'OK'
          });
        }
        this.isLoadingMarks = false;
      }
    });
  }

  // Map marks from database to form values
  mapMarksToForm(marks: any[], isSupervisor: boolean): void {
    marks.forEach(mark => {
      const soalanId = isSupervisor ? mark.idSoalan - 100 : mark.idSoalan;
      const suffix = isSupervisor ? '2' : '';
      
      switch (soalanId) {
        case 1:
          this.formValues[`ilmuPengetahuan${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 2:
          this.formValues[`kuantitiHasil${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 3:
          this.formValues[`kualitiHasil${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 4:
          this.formValues[`penganalisisan${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 5:
          this.formValues[`nilaiTambah${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 6:
          this.formValues[`integriti${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 7:
          this.formValues[`disiplin${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 8:
          this.formValues[`kepimpinan${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 9:
          this.formValues[`kreatifProaktif${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 10:
          this.formValues[`kawalanDiri${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
        case 11:
          this.formValues[`jalinanHubungan${suffix}` as keyof typeof this.formValues] = mark.markah;
          break;
      }
    });
  }

  // Calculate overall percentage whenever any input changes
  calculateMarkahKeseluruhan(): void {
    // Column 1 calculation (Self Evaluation)
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

    // Column 2 calculation (Supervisor Evaluation)
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

    // Define criteria with their corresponding idSoalan
    const criteria = [
      // Pengetahuan, Kemahiran dan Penghasilan Kerja (IDs 1-5)
      { id: 1, name: 'ilmuPengetahuan', col1: this.formValues.ilmuPengetahuan, col2: this.formValues.ilmuPengetahuan2 },
      { id: 2, name: 'kuantitiHasil', col1: this.formValues.kuantitiHasil, col2: this.formValues.kuantitiHasil2 },
      { id: 3, name: 'kualitiHasil', col1: this.formValues.kualitiHasil, col2: this.formValues.kualitiHasil2 },
      { id: 4, name: 'penganalisisan', col1: this.formValues.penganalisisan, col2: this.formValues.penganalisisan2 },
      { id: 5, name: 'nilaiTambah', col1: this.formValues.nilaiTambah, col2: this.formValues.nilaiTambah2 },

      // Kualiti Peribadi (IDs 6-11)
      { id: 6, name: 'integriti', col1: this.formValues.integriti, col2: this.formValues.integriti2 },
      { id: 7, name: 'disiplin', col1: this.formValues.disiplin, col2: this.formValues.disiplin2 },
      { id: 8, name: 'kepimpinan', col1: this.formValues.kepimpinan, col2: this.formValues.kepimpinan2 },
      { id: 9, name: 'kreatifProaktif', col1: this.formValues.kreatifProaktif, col2: this.formValues.kreatifProaktif2 },
      { id: 10, name: 'kawalanDiri', col1: this.formValues.kawalanDiri, col2: this.formValues.kawalanDiri2 },
      { id: 11, name: 'jalinanHubungan', col1: this.formValues.jalinanHubungan, col2: this.formValues.jalinanHubungan2 }
    ];

    const currentTimestamp = new Date().toISOString();

    // Create records for each criterion (Column 1 - Self/Employee evaluation)
    criteria.forEach((criterion) => {
      if (criterion.col1 !== null && criterion.col1 !== undefined) {
        records.push({
          idPenilaian: this.idPenilaian,
          idSoalan: criterion.id,
          markah: criterion.col1,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        });
      }
    });

    // Create records for each criterion (Column 2 - Supervisor evaluation)
    // Using IDs 101-111 to differentiate from column 1
    criteria.forEach((criterion) => {
      if (criterion.col2 !== null && criterion.col2 !== undefined) {
        records.push({
          idPenilaian: this.idPenilaian,
          idSoalan: criterion.id + 100, // 101-111 for supervisor evaluations
          markah: criterion.col2,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        });
      }
    });

    console.log('Records to save:', records);

    if (records.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Amaran',
        text: 'Tiada markah untuk disimpan.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Call the service to save multiple records
    this.markahSoalan.simpanMultipleMarkahSoalan(records).subscribe({
      next: (info) => {
        console.log("API response:", info);
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: `${records.length} rekod markah berjaya disimpan.`,
          confirmButtonText: 'OK'
        }).then(() => {
          // Reload the marks after successful save
          if (this.idPenilaian) {
            this.loadExistingMarks(this.idPenilaian);
          }
        });
      },
      error: (err) => {
        console.error('Save error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: 'Gagal menyimpan markah. Sila cuba lagi.',
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
  loadMockMarks(): void {
    console.log('Loading mock marks for testing...');
    
    // Mock self-evaluation marks (Column 1)
    const mockSelfMarks = [
      { idSoalan: 1, markah: 7 },  // ilmuPengetahuan
      { idSoalan: 2, markah: 8 },  // kuantitiHasil
      { idSoalan: 3, markah: 7 },  // kualitiHasil
      { idSoalan: 4, markah: 6 },  // penganalisisan
      { idSoalan: 5, markah: 8 },  // nilaiTambah
      { idSoalan: 6, markah: 9 },  // integriti
      { idSoalan: 7, markah: 8 },  // disiplin
      { idSoalan: 8, markah: 7 },  // kepimpinan
      { idSoalan: 9, markah: 7 },  // kreatifProaktif
      { idSoalan: 10, markah: 8 }, // kawalanDiri
      { idSoalan: 11, markah: 9 }  // jalinanHubungan
    ];
    
    // Mock supervisor marks (Column 2) - fewer marks to show partial evaluation
    // const mockSupervisorMarks = [
    //   { idSoalan: 101, markah: 8 }, // ilmuPengetahuan2
    //   { idSoalan: 102, markah: 9 }, // kuantitiHasil2
    //   { idSoalan: 103, markah: 8 }, // kualitiHasil2
      // Leaving some empty to test partial entry
    // ];
    
    // Map the mock data to form
    this.mapMarksToForm(mockSelfMarks, false);
    // this.mapMarksToForm(mockSupervisorMarks, true);
    
    // Recalculate totals
    this.calculateMarkahKeseluruhan();
    
    console.log('Mock marks loaded successfully');
    console.log('Form values:', this.formValues);
    console.log('Markah Keseluruhan (Self):', this.markahKeseluruhan);
    console.log('Markah Keseluruhan (Supervisor):', this.markahKeseluruhan2);
  }
  
  // Method to manually set idPenilaian for testing
  setTestIdPenilaian(id: number): void {
    console.log('Setting test idPenilaian:', id);
    this.idPenilaian = id;
    this.mockIdPenilaian = id;
  }
  
  // Method to clear all marks for testing
  clearAllMarks(): void {
    console.log('Clearing all marks...');
    Object.keys(this.formValues).forEach(key => {
      (this.formValues as any)[key] = null;
    });
    this.calculateMarkahKeseluruhan();
    console.log('All marks cleared');
  }
  
  // Method to switch between test and production mode
  toggleTestMode(): void {
    this.testMode = !this.testMode;
    console.log('Test mode:', this.testMode ? 'ON' : 'OFF');
    if (this.testMode) {
      this.loadMockMarks();
    } else {
      this.clearAllMarks();
    }
  }
  
  // Method to test API call with current mockIdPenilaian
  testApiCall(): void {
    if (!this.mockIdPenilaian) {
      console.error('No mockIdPenilaian set');
      Swal.fire({
        icon: 'error',
        title: 'Test Error',
        text: 'Please set a mock idPenilaian first',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    console.log('Testing API call with idPenilaian:', this.mockIdPenilaian);
    this.loadExistingMarks(this.mockIdPenilaian);
  }
}