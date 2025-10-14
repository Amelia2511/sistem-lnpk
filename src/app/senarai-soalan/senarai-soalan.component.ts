import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { markahSoalan } from '../model/markah-soalan.model';
import Swal from 'sweetalert2';
import { MarkahSoalanService } from '../services/markah-soalan.service';
import { RoleStateService } from '../services/role-state.service';
import { AuthService } from '../auth/auth.service';
import { PenilaianService } from '../services/penilaian.service';
import { penilaian } from '../model/penilaian.model';

@Component({
  selector: 'app-senarai-soalan',
  imports: [DividerModule, InputNumberModule, TableModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './senarai-soalan.component.html',
  styleUrl: './senarai-soalan.component.css'
})
export class SenaraiSoalanComponent implements OnInit {
  a1 = 1;

  // Data for the Skala table
  skalaData = [
    { level: 'Scale Values', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
  ];

  details: markahSoalan = {} as markahSoalan;
  markah: string | null = null;
  products: any[] = [];

  idPenilaian: number | null = null; 
  idPyd: number | null = null;
  idSkt: number | null = null;
  evaluatorType: string = 'self'; 

  formValues = {
    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 1
    ilmuPengetahuan: null as number | null,
    kuantitiHasil: null as number | null,
    kualitiHasil: null as number | null,
    penganalisisan: null as number | null,
    nilaiTambah: null as number | null,

    // Pengetahuan, Kemahiran dan Penghasilan Kerja - Column 2 (set to null)
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

    // Kualiti Peribadi - Column 2 (set to null)
    integriti2: null as number | null,
    disiplin2: null as number | null,
    kepimpinan2: null as number | null,
    kreatifProaktif2: null as number | null,
    kawalanDiri2: null as number | null,
    jalinanHubungan2: null as number | null
  };

  markahKeseluruhan: number = 0;
  markahKeseluruhan2: number = 0;

  constructor(private router: Router, private markahSoalan: MarkahSoalanService, private roleState: RoleStateService, private route: ActivatedRoute, private authService: AuthService, private penilaian: PenilaianService) { }

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
      this.markahKeseluruhan = (average1 / 10) * 100; // Convert scale 1-10 to percentage
    }

    // Calculate Column 2 percentage
    if (column2Values.length === 0) {
      this.markahKeseluruhan2 = 0;
    } else {
      const total2 = column2Values.reduce((sum, val) => sum + val, 0);
      const average2 = total2 / column2Values.length;
      this.markahKeseluruhan2 = (average2 / 10) * 100; // Convert scale 1-10 to percentage
    }
  }

  // Method to handle input changes
  onInputChange(): void {
    this.calculateMarkahKeseluruhan();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.noKP) {
        console.log("PPP noKp:", user.noKP);

        this.penilaian.getLatestPydPenilaianByPppNoKp(user.noKP).subscribe({
          next: (res) => {
            console.log("PYD Penilaian Info:", res);

            this.idPyd = res.idPyd;
            this.idSkt = res.idSkt;
            this.idPenilaian = res.idPenilaian ?? null;

            if (this.idPenilaian) {
              this.penilaian.setIdPenilaian(this.idPenilaian);
            } else {
              console.warn("No Penilaian ID found for this PYD.");
            }
          },
          error: (err) => {
            console.error("Error fetching PYD info:", err);
          }
        });
      } else {
        console.warn("No PPP or noKp found in authService.");
      }
    });

    if (this.markah && this.idPenilaian) {
      this.markahSoalan.getMarkahSoalan(this.markah).subscribe({
        next: (info) => {
          console.log("API response:", info);
          this.products = info;
        },
        error: (error) => {
          console.error("API Error:", error.status, error.message);
        }
      });
    }
    else {
      console.log("Waiting for markah or idPenilaian:", { markah: this.markah, idPenilaian: this.idPenilaian });
    }
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
    if (
      !this.formValues.ilmuPengetahuan ||
      !this.formValues.kuantitiHasil ||
      !this.formValues.kualitiHasil ||
      !this.formValues.penganalisisan ||
      !this.formValues.nilaiTambah ||
      !this.formValues.integriti ||
      !this.formValues.disiplin ||
      !this.formValues.kepimpinan ||
      !this.formValues.kreatifProaktif ||
      !this.formValues.kawalanDiri ||
      !this.formValues.jalinanHubungan
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Markah tidak diisi dengan lengkap!',
        text: 'Sila lengkapkan semua markah.',
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

    // Add overall scores
    // if (this.markahKeseluruhan > 0) {
    //   records.push({
    //     idPenilaian: this.idPenilaian,
    //     idSoalan: null,
    //     markah: this.markahKeseluruhan,
    //     createdAt: currentTimestamp,
    //     updatedAt: currentTimestamp
    //   });
    // }

    // if (this.markahKeseluruhan2 > 0) {
    //   records.push({
    //     idPenilaian: this.idPenilaian,
    //     idSoalan: null,
    //     markah: this.markahKeseluruhan2,
    //     createdAt: currentTimestamp,
    //     updatedAt: currentTimestamp
    //   });
    // }

    console.log('Records to save:', records);

    this.markahSoalan.simpanMultipleMarkahSoalan(records).subscribe({
      next: (info) => {
        console.log('Save successful:', info);
        Swal.fire({
          icon: 'success',
          title: 'Berjaya!',
          text: `${records.length} rekod markah berjaya disimpan.`,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/penilaian-prestasi']);
        });
        return;
      },
      error: (err) => {
        console.error('Save error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Ralat!',
          text: 'Gagal menyimpan markah. Sila cuba lagi.',
          confirmButtonText: 'OK'
        });
        return;
      }
    });
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }
}