import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

import Swal from 'sweetalert2';

import { PenilaianService } from '../services/penilaian.service';
import { PegawaiService } from '../services/pegawai.service';
import {
  SasaranKerjaService,
  SasaranAktivitiRow,
} from '../services/sasaran-kerja.service';
import { UlasanPenilaianService } from '../services/ulasan-penilaian.service';
import { AuthService } from '../auth/auth.service';
import { RoleStateService } from '../services/role-state.service';

import { SenaraiSoalanComponent } from '../senarai-soalan/senarai-soalan.component';
import { SasaranTableComponent } from '../sasaran-table/sasaran-table.component';

import { AktivitiGroup, Petunjuk } from '../model/aktiviti-group.model';
import {
  UlasanPenilaian,
  UlasanCombinedView,
  SaveUlasanRequest,
  SahkanPenilaianRequest,
} from '../model/ulasan-penilaian.model';
import { userDTO } from '../model/userDTO.model';

import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-penilaian',
  standalone: true,
  imports: [
    SenaraiSoalanComponent,
    SasaranTableComponent,
    FormsModule,
    CommonModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    DividerModule,
    SelectButtonModule,
    StepperModule,
    TableModule,
    TagModule,
    TextareaModule,
  ],
  templateUrl: './penilaian.component.html',
  styleUrl: './penilaian.component.css',
})
export class PenilaianComponent implements OnInit {
  @ViewChild(SenaraiSoalanComponent)
  senaraiSoalanComponent!: SenaraiSoalanComponent;

  idPenilaian!: number;
  idPyd!: number;
  idSkt!: number;
  tahunPenilaian: number | null = null;
  kategoriPenilaian: string | null = null;
  loading = true;

  currentUser: userDTO | null = null;

  idPpp: number | null = null;
  idPpk: number | null = null;

  isPpp: boolean = false;
  isPpk: boolean = false;
  isPpsm: boolean = false;

  noKpPpp: string | null = null;
  noKpPpk: string | null = null;

  // Pegawai properties
  pegawai: any = null;
  loadingPegawai = true;

  pppDetails: any = null;
  ppkDetails: any = null;

  // Sasaran properties
  rows: SasaranAktivitiRow[] = [];
  groups: AktivitiGroup[] = [];
  pagedGroups: AktivitiGroup[] = [];
  loadingSasaran = true;

  // ⭐ Step 4 - Ulasan properties
  tempohPengawasan: number | null = null;
  ulasanPrestasi: string = '';
  ulasanKerjaya: string = '';
  checkedPrestasi: boolean = false;
  checkedMarkah: boolean = false;
  loadingUlasan = false;

  ulasanCombined: UlasanCombinedView | null = null;
  stateOptions: any[] = [
    { label: 'Pegawai Penilai Pertama', value: 'ppp' },
    { label: 'Pegawai Penilai Kedua', value: 'ppk' },
  ];
  selectedPenilai: string = 'ppp';

  tempohPengawasanPpp: number | null = null;
  ulasanPrestasiPpp: string = '';
  ulasanKerjayaPpp: string = '';
  checkedPrestasiPpp: boolean = false;
  checkedMarkahPpp: boolean = false;

  tempohPengawasanPpk: number | null = null;
  ulasanPrestasiPpk: string = '';
  ulasanKerjayaPpk: string = '';
  checkedPrestasiPpk: boolean = false;
  checkedMarkahPpk: boolean = false;

  constructor(
    private penilaian: PenilaianService,
    private pegawaiService: PegawaiService,
    private skService: SasaranKerjaService,
    private ulasanService: UlasanPenilaianService,
    private roleStateService: RoleStateService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log('👤 Current user:', this.currentUser);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.idPenilaian = +id;
        console.log('📋 idPenilaian:', this.idPenilaian);
        this.loadPenilaianData();
      }
    });
  }

  loadPenilaianData(): void {
    this.penilaian.getPenilaianById(this.idPenilaian).subscribe({
      next: (data) => {
        this.tahunPenilaian = data.tahunPenilaian;
        this.kategoriPenilaian = data.kategoriPenilaian;
        this.idPyd = data.idPyd;
        this.idSkt = data.idSkt;

        console.log('✅ Loaded penilaian data');

        this.loading = false;

        // ⭐ Load Sasaran Kerja first to get idPPP and idPPK
        this.loadSasaranKerjaDetails();

        this.loadPegawaiDetails();
        this.loadSasaranDetails();
      },
      error: (err) => {
        console.error('❌ Error loading penilaian:', err);
        this.loading = false;
      },
    });
  }

  loadSasaranKerjaDetails(): void {
    if (!this.idSkt) {
      console.error('❌ No idSkt found');
      return;
    }

    console.log('🔄 Starting loadSasaranKerjaDetails for idSkt:', this.idSkt);

    this.skService.getSasaranById(this.idSkt).subscribe({
      next: (data) => {
        this.idPpp = data.idPpp;
        this.idPpk = data.idPpk;

        console.log('📋 Loaded Sasaran Kerja');
        console.log('🔍 idPPP from Sasaran:', this.idPpp);
        console.log('🔍 idPPK from Sasaran:', this.idPpk);
        console.log('🔍 Current user object:', this.currentUser);
        console.log('🔍 Current user.id:', this.currentUser?.id);

        // Check roles
        if (this.currentUser) {
          this.isPpp = this.currentUser.id === this.idPpp;
          this.isPpk = this.currentUser.id === this.idPpk;

          console.log(
            '✅ Is user PPP?',
            this.isPpp,
            `(${this.currentUser.id} === ${this.idPpp})`
          );
          console.log(
            '✅ Is user PPK?',
            this.isPpk,
            `(${this.currentUser.id} === ${this.idPpk})`
          );
          console.log('✅ Is user PPSM?', this.hasRole(5));
        }

        // ⭐ Load PPP and PPK details first, then load ulasan
        const loadPegawai$ = [];

        if (this.idPpp) {
          console.log('🔄 Preparing to load PPP details for id:', this.idPpp);
          loadPegawai$.push(
            this.pegawaiService.getPegawaiPenilaiById(this.idPpp).pipe(
              tap({
                next: (pegawaiData) => {
                  console.log('📦 ✅ Received PPP data from API:', pegawaiData);
                  console.log('📦 PPP nama:', pegawaiData.nama);
                  console.log('📦 PPP noKp:', pegawaiData.noKp);
                  console.log('📦 PPP namaJawatan:', pegawaiData.namaJawatan);
                  console.log('📦 PPP namaUnit:', pegawaiData.namaUnit);

                  this.pppDetails = {
                    nama: pegawaiData.nama,
                    noKP: pegawaiData.noKp,
                    jawatan: pegawaiData.namaJawatan,
                    gred: pegawaiData.gredDisandang,
                    unit: pegawaiData.namaUnit,
                    tarikhHantar: null,
                  };

                  console.log('✅ Assigned pppDetails:', this.pppDetails);
                },
                error: (err) => {
                  console.error('❌ Error in PPP tap:', err);
                },
              })
            )
          );
        } else {
          console.log('⚠️ No idPpp - skipping PPP load');
        }

        if (this.idPpk) {
          console.log('🔄 Preparing to load PPK details for id:', this.idPpk);
          loadPegawai$.push(
            this.pegawaiService.getPegawaiPenilaiById(this.idPpk).pipe(
              tap({
                next: (pegawaiData) => {
                  console.log('📦 ✅ Received PPK data from API:', pegawaiData);
                  console.log('📦 PPK nama:', pegawaiData.nama);
                  console.log('📦 PPK noKp:', pegawaiData.noKp);
                  console.log('📦 PPK namaJawatan:', pegawaiData.namaJawatan);
                  console.log('📦 PPK namaUnit:', pegawaiData.namaUnit);

                  this.ppkDetails = {
                    nama: pegawaiData.nama,
                    noKP: pegawaiData.noKp,
                    jawatan: pegawaiData.namaJawatan,
                    gred: pegawaiData.gredDisandang,
                    unit: pegawaiData.namaUnit,
                    tarikhHantar: null,
                  };

                  console.log('✅ Assigned ppkDetails:', this.ppkDetails);
                },
                error: (err) => {
                  console.error('❌ Error in PPK tap:', err);
                },
              })
            )
          );
        } else {
          console.log('⚠️ No idPpk - skipping PPK load');
        }

        console.log('📊 Number of pegawai to load:', loadPegawai$.length);

        // ⭐ Wait for all pegawai details to load, then load ulasan
        if (loadPegawai$.length > 0) {
          console.log(
            '🔄 Starting forkJoin for',
            loadPegawai$.length,
            'pegawai'
          );

          forkJoin(loadPegawai$).subscribe({
            next: (results) => {
              console.log('✅✅✅ forkJoin completed successfully');
              console.log('📊 forkJoin results:', results);
              console.log('👤 Final PPP Details:', this.pppDetails);
              console.log('👤 Final PPK Details:', this.ppkDetails);

              // Now load ulasan (tarikhHantar will be set correctly)
              this.loadUlasanDetails();
            },
            error: (err) => {
              console.error('❌ forkJoin error:', err);
              console.error('❌ Error details:', JSON.stringify(err));
              // Still load ulasan even if pegawai fails
              this.loadUlasanDetails();
            },
          });
        } else {
          console.log('⚠️ No pegawai to load - proceeding to ulasan');
          this.loadUlasanDetails();
        }
      },
      error: (err) => {
        console.error('❌ Error loading sasaran kerja details:', err);
        console.error('❌ Error details:', JSON.stringify(err));
      },
    });
  }

  // loadPenilaiDetails(): void {
  //   // Load PPP details
  //   if (this.idPpp) {
  //     this.pegawaiService.getPegawaiById(this.idPpp).subscribe({
  //       next: (data) => {
  //         this.pppDetails = {
  //           nama: data.nama,
  //           noKP: data.noKp,
  //           jawatan: data.namaJawatan,
  //           unit: data.namaUnit,
  //           // tarikhHantar: null // Will be loaded from ulasan
  //         };
  //         console.log('✅ Loaded PPP details:', this.pppDetails);
  //       },
  //       error: (err) => {
  //         console.error('❌ Error loading PPP details:', err);
  //       }
  //     });
  //   }

  //   // Load PPK details
  //   if (this.idPpk) {
  //     this.pegawaiService.getPegawaiById(this.idPpk).subscribe({
  //       next: (data) => {
  //         this.ppkDetails = {
  //           nama: data.nama,
  //           noKP: data.noKp,
  //           jawatan: data.namaJawatan,
  //           unit: data.namaUnit,
  //           tarikhHantar: null // Will be loaded from ulasan
  //         };
  //         console.log('✅ Loaded PPK details:', this.ppkDetails);
  //       },
  //       error: (err) => {
  //         console.error('❌ Error loading PPK details:', err);
  //       }
  //     });
  //   }
  // }

  loadPegawaiDetails(): void {
    if (!this.idPyd) {
      console.error('❌ No idPyd found');
      this.loadingPegawai = false;
      return;
    }

    this.pegawaiService.getPegawaiById(this.idPyd).subscribe({
      next: (data) => {
        this.pegawai = data;
        console.log('✅ Loaded pegawai:', this.pegawai);
        this.loadingPegawai = false;
      },
      error: (err) => {
        console.error('❌ Error loading pegawai:', err);
        this.loadingPegawai = false;
      },
    });
  }

  loadSasaranDetails(): void {
    if (!this.idSkt) {
      console.error('❌ No idSkt found');
      this.loadingSasaran = false;
      return;
    }

    this.skService.getAktivitiRows(this.idSkt).subscribe({
      next: (data) => {
        this.rows = data ?? [];
        this.buildGroups();
        this.loadingSasaran = false;
      },
      error: (err) => {
        console.error('❌ Error loading sasaran:', err);
        this.loadingSasaran = false;
      },
    });
  }

  private buildGroups(): void {
    const map = new Map<number, AktivitiGroup>();

    for (const r of this.rows) {
      if (!map.has(r.idAktiviti)) {
        map.set(r.idAktiviti, {
          idAktiviti: r.idAktiviti,
          aktiviti: r.aktiviti,
          petunjuk: [],
        });
      }

      map.get(r.idAktiviti)!.petunjuk.push({
        idPprestasi: r.idPprestasi,
        jenisPetunjuk: r.jenisPetunjuk,
        keterangan: r.keterangan,
        sasaranKerja: r.sasaranKerja,
        pencapaianSebenar: r.pencapaianSebenar,
        ulasan: r.ulasan,
      });
    }

    this.groups = Array.from(map.values());
    this.pagedGroups = this.groups;
  }

  async onSimpanMarkah(): Promise<void> {
    if (this.senaraiSoalanComponent) {
      await this.senaraiSoalanComponent.simpan();
    }
  }

  onMarkahSaved(): void {
    console.log('✅ Markah saved successfully');
  }

  // ⭐ Updated loadUlasanDetails - checks isPpp/isPpk correctly
  // loadUlasanDetails(): void {
  //   this.loadingUlasan = true;

  //   // ⭐ Check if user has PPSM role (role 5)
  //   const isPpsm = this.hasRole(5);

  //   if (isPpsm) {
  //     // ⭐ PPSM loads both PPP and PPK ulasan using idSkt
  //     console.log('🔍 PPSM loading combined ulasan for SKT:', this.idSkt);
  //     this.ulasanService.getUlasanBySkt(this.idSkt).subscribe({
  //       next: (data) => {
  //         this.ulasanCombined = data;

  //         // ⭐ Load PPP data by default
  //         this.loadUlasanForSelectedPenilai();

  //         this.loadingUlasan = false;
  //         console.log('✅ Loaded combined ulasan:', this.ulasanCombined);
  //       },
  //       error: (err) => {
  //         if (err.status === 404) {
  //           console.log('ℹ️ No existing ulasan found for this SKT');
  //         } else {
  //           console.error('❌ Error loading combined ulasan:', err);
  //         }
  //         this.loadingUlasan = false;
  //       }
  //     });
  //   } else {
  //     // ⭐ PPP/PPK load their own ulasan using idPenilaian
  //     console.log('🔍 Loading ulasan for penilaian:', this.idPenilaian);
  //     console.log('🔍 User is PPP?', this.isPpp);
  //     console.log('🔍 User is PPK?', this.isPpk);

  //     this.ulasanService.getUlasanByPenilaian(this.idPenilaian).subscribe({
  //       next: (data) => {
  //         console.log('✅ Loaded ulasan:', data);

  //         this.tempohPengawasan = data.tempohPengawasanBulan;
  //         this.ulasanPrestasi = data.ulasanPrestasi || '';
  //         this.ulasanKerjaya = data.ulasanKerjaya || '';
  //         this.checkedPrestasi = data.sahMaklumPrestasi || false;
  //         this.checkedMarkah = data.sahMaklumMarkah || false;

  //         this.loadingUlasan = false;
  //       },
  //       error: (err) => {
  //         if (err.status === 404) {
  //           console.log('ℹ️ No existing ulasan found');
  //         } else {
  //           console.error('❌ Error loading ulasan:', err);
  //         }
  //         this.loadingUlasan = false;
  //       }
  //     });
  //   }
  // }

  loadUlasanDetails(): void {
    this.loadingUlasan = true;

    if (this.hasRole(5) || this.isPpk) {
      // ⭐ PPSM and PPK load both PPP and PPK ulasan using idSkt
      const userType = this.hasRole(5) ? 'PPSM' : 'PPK';
      console.log(
        `🔍 ${userType} loading combined ulasan for SKT:`,
        this.idSkt
      );

      this.ulasanService.getUlasanBySkt(this.idSkt).subscribe({
        next: (data) => {
          this.ulasanCombined = data;

          // ⭐ Load tarikhHantar for PPP and PPK
          if (this.pppDetails && data.ulasanPpp?.tarikhHantar) {
            this.pppDetails.tarikhHantar = data.ulasanPpp.tarikhHantar;
          }
          if (this.ppkDetails && data.ulasanPpk?.tarikhHantar) {
            this.ppkDetails.tarikhHantar = data.ulasanPpk.tarikhHantar;
          }

          // ⭐ PPK defaults to their own view (ppk), PPSM defaults to ppp
          if (this.isPpk) {
            this.selectedPenilai = 'ppk';
          }

          // ⭐ Load data based on selected penilai
          this.loadUlasanForSelectedPenilai();

          this.loadingUlasan = false;
          console.log('✅ Loaded combined ulasan:', this.ulasanCombined);
        },
        error: (err) => {
          if (err.status === 404) {
            console.log('ℹ️ No existing ulasan found for this SKT');
          } else {
            console.error('❌ Error loading combined ulasan:', err);
          }
          this.loadingUlasan = false;
        },
      });
    } else {
      // ⭐ PPP loads only their own ulasan using idPenilaian
      console.log('🔍 PPP loading ulasan for penilaian:', this.idPenilaian);
      this.ulasanService.getUlasanByPenilaian(this.idPenilaian).subscribe({
        next: (data) => {
          console.log('✅ Loaded ulasan:', data);

          this.tempohPengawasan = data.tempohPengawasanBulan;
          this.ulasanPrestasi = data.ulasanPrestasi || '';
          this.ulasanKerjaya = data.ulasanKerjaya || '';
          this.checkedPrestasi = data.sahMaklumPrestasi || false;
          this.checkedMarkah = data.sahMaklumMarkah || false;

          // ⭐ Update tarikhHantar for PPP
          if (this.pppDetails && data.tarikhHantar) {
            this.pppDetails.tarikhHantar = data.tarikhHantar;
          }

          this.loadingUlasan = false;
        },
        error: (err) => {
          if (err.status === 404) {
            console.log('ℹ️ No existing ulasan found');
          } else {
            console.error('❌ Error loading ulasan:', err);
          }
          this.loadingUlasan = false;
        },
      });
    }
  }

  get currentPenilaiDetails(): any {
    console.log('🔍 Getting currentPenilaiDetails');
    console.log('🔍 selectedPenilai:', this.selectedPenilai);
    console.log('🔍 pppDetails:', this.pppDetails);
    console.log('🔍 ppkDetails:', this.ppkDetails);

    if (this.selectedPenilai === 'ppp') {
      return this.pppDetails;
    } else {
      return this.ppkDetails;
    }
  }

  // ⭐ Helper method to check roles
  hasRole(roleId: number): boolean {
    return this.roleStateService.hasRole(roleId);
  }

  // Add these getters after the hasRole method (around line 567):

  // Determine if select button should be disabled
  get isSelectButtonDisabled(): boolean {
    // PPP cannot switch to PPK view
    if (this.isPpp) {
      return this.selectedPenilai === 'ppk';
    }
    // PPK and PPSM can switch freely
    return false;
  }

  // Determine if input fields should be readonly
  get isFieldsReadonly(): boolean {
    // PPSM can only view, not edit
    if (this.hasRole(5)) {
      return true;
    }

    // PPK viewing PPP's ulasan cannot edit
    if (this.isPpk && this.selectedPenilai === 'ppp') {
      return true;
    }

    // PPP viewing own ulasan can edit
    // PPK viewing own ulasan can edit
    return false;
  }

  // Determine if user can see select button at all
  get canViewSelectButton(): boolean {
    // PPSM can view both
    if (this.hasRole(5)) {
      return true;
    }

    // PPK can view both (but can only edit their own)
    if (this.isPpk) {
      return true;
    }

    // PPP can only view their own
    return false;
  }
  // Keep these methods as they are:
  loadUlasanForSelectedPenilai(): void {
    if (!this.ulasanCombined) return;

    if (this.selectedPenilai === 'ppp') {
      // Load PPP's ulasan
      if (this.ulasanCombined.ulasanPpp) {
        this.tempohPengawasan =
          this.ulasanCombined.ulasanPpp.tempohPengawasanBulan;
        this.ulasanPrestasi =
          this.ulasanCombined.ulasanPpp.ulasanPrestasi || '';
        this.ulasanKerjaya = this.ulasanCombined.ulasanPpp.ulasanKerjaya || '';
        this.checkedPrestasi =
          this.ulasanCombined.ulasanPpp.sahMaklumPrestasi || false;
        this.checkedMarkah =
          this.ulasanCombined.ulasanPpp.sahMaklumMarkah || false;
        console.log('📋 Loaded PPP ulasan');
      } else {
        // Clear fields if no PPP ulasan
        this.clearUlasanFields();
        console.log('⚠️ No PPP ulasan available');
      }
    } else {
      // Load PPK's ulasan
      if (this.ulasanCombined.ulasanPpk) {
        this.tempohPengawasan =
          this.ulasanCombined.ulasanPpk.tempohPengawasanBulan;
        this.ulasanPrestasi =
          this.ulasanCombined.ulasanPpk.ulasanPrestasi || '';
        this.ulasanKerjaya = this.ulasanCombined.ulasanPpk.ulasanKerjaya || '';
        this.checkedPrestasi =
          this.ulasanCombined.ulasanPpk.sahMaklumPrestasi || false;
        this.checkedMarkah =
          this.ulasanCombined.ulasanPpk.sahMaklumMarkah || false;
        console.log('📋 Loaded PPK ulasan');
      } else {
        // Clear fields if no PPK ulasan
        this.clearUlasanFields();
        console.log('⚠️ No PPK ulasan available');
      }
    }
  }

  clearUlasanFields(): void {
    this.tempohPengawasan = null;
    this.ulasanPrestasi = '';
    this.ulasanKerjaya = '';
    this.checkedPrestasi = false;
    this.checkedMarkah = false;
  }

  onPenilaiChange(): void {
    console.log('🔄 Penilai changed to:', this.selectedPenilai);
    console.log('🔍 ulasanCombined:', this.ulasanCombined);
    console.log('🔍 PPP ulasan:', this.ulasanCombined?.ulasanPpp);
    console.log('🔍 PPK ulasan:', this.ulasanCombined?.ulasanPpk);
    console.log('🔍 Current penilai details:', this.currentPenilaiDetails);

    this.loadUlasanForSelectedPenilai();

    // Force change detection
    console.log('🔍 After load - tempohPengawasan:', this.tempohPengawasan);
    console.log('🔍 After load - ulasanPrestasi:', this.ulasanPrestasi);
    console.log('🔍 After load - ulasanKerjaya:', this.ulasanKerjaya);
  }

  get currentPenilaiName(): string {
    if (!this.ulasanCombined) return '-';

    if (this.selectedPenilai === 'ppp') {
      return this.ulasanCombined.ulasanPpp?.namaPenilai || '-';
    } else {
      return this.ulasanCombined.ulasanPpk?.namaPenilai || '-';
    }
  }

  get currentTarikhHantar(): Date | undefined {
    if (!this.ulasanCombined) return undefined;

    if (this.selectedPenilai === 'ppp') {
      return this.ulasanCombined.ulasanPpp?.tarikhHantar;
    } else {
      return this.ulasanCombined.ulasanPpk?.tarikhHantar;
    }
  }

  // ⭐ Save ulasan (Step 4 - Simpan button)
  // async onSimpanUlasan(): Promise<void> {
  //   // ⭐ Validate inputs with null check
  //   if (!this.tempohPengawasan || this.tempohPengawasan < 1) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Tempoh Pengawasan Diperlukan',
  //       text: 'Sila isi tempoh pengawasan dalam bulan.',
  //     });
  //     return;
  //   }

  //   if (!this.ulasanPrestasi.trim()) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Ulasan Prestasi Diperlukan',
  //       text: 'Sila isi ulasan prestasi keseluruhan.',
  //     });
  //     return;
  //   }

  //   if (!this.ulasanKerjaya.trim()) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Ulasan Kerjaya Diperlukan',
  //       text: 'Sila isi ulasan kemajuan kerjaya.',
  //     });
  //     return;
  //   }

  //   const request: SaveUlasanRequest = {
  //     idPenilaian: this.idPenilaian,
  //     tempohPengawasanBulan: this.tempohPengawasan as number, // ⭐ Type assertion
  //     ulasanPrestasi: this.ulasanPrestasi,
  //     ulasanKerjaya: this.ulasanKerjaya,
  //     sahMaklumPrestasi: this.checkedPrestasi,
  //     sahMaklumMarkah: this.checkedMarkah,
  //   };

  //   console.log('💾 Saving ulasan:', request);

  //   this.ulasanService.saveUlasan(request).subscribe({
  //     next: async () => {
  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Berjaya',
  //         text: 'Ulasan berjaya disimpan',
  //       });
  //     },
  //     error: async (err) => {
  //       console.error('❌ Error saving ulasan:', err);
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Gagal',
  //         text: err?.error?.error || 'Ralat semasa menyimpan ulasan',
  //       });
  //     },
  //   });
  // }

  // ⭐ Save ulasan (Step 4 - Simpan button)
  async onSimpanUlasan(): Promise<void> {
    // ⭐ Validate inputs with null check
    if (!this.tempohPengawasan || this.tempohPengawasan < 1) {
      await Swal.fire({
        icon: 'warning',
        title: 'Tempoh Pengawasan Diperlukan',
        text: 'Sila isi tempoh pengawasan dalam bulan.',
      });
      return;
    }

    if (!this.ulasanPrestasi.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Ulasan Prestasi Diperlukan',
        text: 'Sila isi ulasan prestasi keseluruhan.',
      });
      return;
    }

    if (!this.ulasanKerjaya.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Ulasan Kerjaya Diperlukan',
        text: 'Sila isi ulasan kemajuan kerjaya.',
      });
      return;
    }

    const request: SaveUlasanRequest = {
      idPenilaian: this.idPenilaian,
      tempohPengawasanBulan: this.tempohPengawasan as number,
      ulasanPrestasi: this.ulasanPrestasi,
      ulasanKerjaya: this.ulasanKerjaya,
      sahMaklumPrestasi: this.checkedPrestasi,
      sahMaklumMarkah: this.checkedMarkah,
    };

    console.log('💾 Saving ulasan:', request);

    this.ulasanService.saveUlasan(request).subscribe({
      next: async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berjaya',
          text: 'Ulasan berjaya disimpan',
        });

        // ⭐ Reload ulasan data to sync with database
        if (this.hasRole(5) || this.isPpk) {
          // Reload combined data for PPSM/PPK
          this.ulasanService.getUlasanBySkt(this.idSkt).subscribe({
            next: (data) => {
              this.ulasanCombined = data;

              // Update tarikhHantar
              if (this.pppDetails && data.ulasanPpp?.tarikhHantar) {
                this.pppDetails.tarikhHantar = data.ulasanPpp.tarikhHantar;
              }
              if (this.ppkDetails && data.ulasanPpk?.tarikhHantar) {
                this.ppkDetails.tarikhHantar = data.ulasanPpk.tarikhHantar;
              }

              // Reload current view
              this.loadUlasanForSelectedPenilai();
              console.log('✅ Reloaded ulasan after save');
            },
            error: (err) => {
              console.error('❌ Error reloading ulasan:', err);
            },
          });
        }
        // PPP doesn't need reload since they can't switch views
      },
      error: async (err) => {
        console.error('❌ Error saving ulasan:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err?.error?.error || 'Ralat semasa menyimpan ulasan',
        });
      },
    });
  }

  // ⭐ Submit ulasan (Step 4 - Hantar button)
  // async onHantarUlasan(): Promise<void> {
  //   // Validate checkboxes
  //   if (!this.checkedPrestasi) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Pengesahan Diperlukan',
  //       text: 'Sila tandakan bahawa anda telah memaklumkan prestasi kepada Pegawai Yang Dinilai.'
  //     });
  //     return;
  //   }

  //   if (!this.checkedMarkah) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Pengesahan Diperlukan',
  //       text: 'Sila tandakan bahawa anda telah memaklumkan markah penilaian kepada Pegawai Yang Dinilai.'
  //     });
  //     return;
  //   }

  //   // ⭐ Validate inputs with null check
  //   if (!this.tempohPengawasan || this.tempohPengawasan < 1) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Tempoh Pengawasan Diperlukan',
  //       text: 'Sila isi tempoh pengawasan dalam bulan.'
  //     });
  //     return;
  //   }

  //   if (!this.ulasanPrestasi.trim() || !this.ulasanKerjaya.trim()) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Ulasan Tidak Lengkap',
  //       text: 'Sila isi semua ulasan sebelum menghantar.'
  //     });
  //     return;
  //   }

  //   // Confirm submission
  //   const result = await Swal.fire({
  //     icon: 'question',
  //     title: 'Hantar Penilaian?',
  //     text: 'Penilaian akan dihantar untuk semakan. Tindakan ini tidak boleh diundur.',
  //     showCancelButton: true,
  //     confirmButtonText: 'Ya, Hantar',
  //     cancelButtonText: 'Batal'
  //   });

  //   if (!result.isConfirmed) return;

  //   const request: SaveUlasanRequest = {
  //     idPenilaian: this.idPenilaian,
  //     tempohPengawasanBulan: this.tempohPengawasan as number, // ⭐ Type assertion
  //     ulasanPrestasi: this.ulasanPrestasi,
  //     ulasanKerjaya: this.ulasanKerjaya,
  //     sahMaklumPrestasi: this.checkedPrestasi,
  //     sahMaklumMarkah: this.checkedMarkah
  //   };

  //   console.log('📤 Submitting ulasan:', request);

  //   this.ulasanService.submitUlasan(request).subscribe({
  //     next: async () => {
  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Berjaya Dihantar',
  //         text: `Penilaian untuk ${this.pegawai?.nama || 'pegawai'} telah berjaya dihantar.`
  //       });

  //       // Navigate back to list
  //       this.router.navigate(['/senarai-penilaian']);
  //     },
  //     error: async (err) => {
  //       console.error('❌ Error submitting ulasan:', err);
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Gagal Menghantar',
  //         text: err?.error?.error || 'Ralat semasa menghantar penilaian'
  //       });
  //     }
  //   });
  // }

  // ⭐ Submit ulasan (Step 4 - Hantar button for PPP/PPK) or Sah (for PPSM)
  // async onHantarUlasan(): Promise<void> {
  //   // ⭐ PPSM approval flow (Sah button)
  //   if (this.hasRole(5)) {
  //     // Confirm approval
  //     const result = await Swal.fire({
  //       icon: 'question',
  //       title: 'Sahkan Penilaian?',
  //       text: 'Penilaian akan disahkan. Tindakan ini tidak boleh diundur.',
  //       showCancelButton: true,
  //       confirmButtonText: 'Ya, Sahkan',
  //       cancelButtonText: 'Batal',
  //     });

  //     if (!result.isConfirmed) return;

  //     const request: SahkanPenilaianRequest = {
  //       idSkt: this.idSkt,
  //     };

  //     console.log('✅ PPSM sahkan penilaian:', request);

  //     this.ulasanService.sahkanPenilaian(request).subscribe({
  //       next: async () => {
  //         await Swal.fire({
  //           icon: 'success',
  //           title: 'Berjaya Disahkan',
  //           text: `Penilaian untuk ${
  //             this.pegawai?.nama || 'pegawai'
  //           } telah berjaya disahkan.`,
  //         });

  //         // Navigate back to list
  //         this.router.navigate(['/senarai-penilaian']);
  //       },
  //       error: async (err) => {
  //         console.error('❌ Error sahkan penilaian:', err);
  //         await Swal.fire({
  //           icon: 'error',
  //           title: 'Gagal Mengesahkan',
  //           text: err?.error?.error || 'Ralat semasa mengesahkan penilaian',
  //         });
  //       },
  //     });
  //     return;
  //   }

  //   // ⭐ PPP/PPK submission flow (Hantar button)
  //   // Validate checkboxes
  //   if (!this.checkedPrestasi) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Pengesahan Diperlukan',
  //       text: 'Sila tandakan bahawa anda telah memaklumkan prestasi kepada Pegawai Yang Dinilai.',
  //     });
  //     return;
  //   }

  //   if (!this.checkedMarkah) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Pengesahan Diperlukan',
  //       text: 'Sila tandakan bahawa anda telah memaklumkan markah penilaian kepada Pegawai Yang Dinilai.',
  //     });
  //     return;
  //   }

  //   // ⭐ Validate inputs with null check
  //   if (!this.tempohPengawasan || this.tempohPengawasan < 1) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Tempoh Pengawasan Diperlukan',
  //       text: 'Sila isi tempoh pengawasan dalam bulan.',
  //     });
  //     return;
  //   }

  //   if (!this.ulasanPrestasi.trim() || !this.ulasanKerjaya.trim()) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Ulasan Tidak Lengkap',
  //       text: 'Sila isi semua ulasan sebelum menghantar.',
  //     });
  //     return;
  //   }

  //   // Confirm submission
  //   const result = await Swal.fire({
  //     icon: 'question',
  //     title: 'Hantar Penilaian?',
  //     text: 'Penilaian akan dihantar untuk semakan. Tindakan ini tidak boleh diundur.',
  //     showCancelButton: true,
  //     confirmButtonText: 'Ya, Hantar',
  //     cancelButtonText: 'Batal',
  //   });

  //   if (!result.isConfirmed) return;

  //   const request: SaveUlasanRequest = {
  //     idPenilaian: this.idPenilaian,
  //     tempohPengawasanBulan: this.tempohPengawasan as number,
  //     ulasanPrestasi: this.ulasanPrestasi,
  //     ulasanKerjaya: this.ulasanKerjaya,
  //     sahMaklumPrestasi: this.checkedPrestasi,
  //     sahMaklumMarkah: this.checkedMarkah,
  //   };

  //   console.log('📤 Submitting ulasan:', request);

  //   this.ulasanService.submitUlasan(request).subscribe({
  //     next: async () => {
  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Berjaya Dihantar',
  //         text: `Penilaian untuk ${
  //           this.pegawai?.nama || 'pegawai'
  //         } telah berjaya dihantar.`,
  //       });

  //       // Navigate back to list
  //       this.router.navigate(['/senarai-penilaian']);
  //     },
  //     error: async (err) => {
  //       console.error('❌ Error submitting ulasan:', err);
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Gagal Menghantar',
  //         text: err?.error?.error || 'Ralat semasa menghantar penilaian',
  //       });
  //     },
  //   });
  // }

  // ⭐ Submit ulasan (Step 4 - Hantar button for PPP/PPK)
  async onHantarUlasan(): Promise<void> {
    // Validate checkboxes
    if (!this.checkedPrestasi) {
      await Swal.fire({
        icon: 'warning',
        title: 'Pengesahan Diperlukan',
        text: 'Sila tandakan bahawa anda telah memaklumkan prestasi kepada Pegawai Yang Dinilai.',
      });
      return;
    }

    if (!this.checkedMarkah) {
      await Swal.fire({
        icon: 'warning',
        title: 'Pengesahan Diperlukan',
        text: 'Sila tandakan bahawa anda telah memaklumkan markah penilaian kepada Pegawai Yang Dinilai.',
      });
      return;
    }

    // Validate inputs
    if (!this.tempohPengawasan || this.tempohPengawasan < 1) {
      await Swal.fire({
        icon: 'warning',
        title: 'Tempoh Pengawasan Diperlukan',
        text: 'Sila isi tempoh pengawasan dalam bulan.',
      });
      return;
    }

    if (!this.ulasanPrestasi.trim() || !this.ulasanKerjaya.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Ulasan Tidak Lengkap',
        text: 'Sila isi semua ulasan sebelum menghantar.',
      });
      return;
    }

    // Confirm submission
    const result = await Swal.fire({
      icon: 'question',
      title: 'Hantar Penilaian?',
      text: 'Penilaian akan dihantar untuk semakan. Tindakan ini tidak boleh diundur.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hantar',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    const request: SaveUlasanRequest = {
      idPenilaian: this.idPenilaian,
      tempohPengawasanBulan: this.tempohPengawasan as number,
      ulasanPrestasi: this.ulasanPrestasi,
      ulasanKerjaya: this.ulasanKerjaya,
      sahMaklumPrestasi: this.checkedPrestasi,
      sahMaklumMarkah: this.checkedMarkah,
    };

    console.log('📤 Submitting ulasan:', request);

    this.ulasanService.submitUlasan(request).subscribe({
      next: async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berjaya Dihantar',
          text: `Penilaian untuk ${
            this.pegawai?.nama || 'pegawai'
          } telah berjaya dihantar.`,
        });

        // Navigate back to list
        this.router.navigate(['/senarai-penilaian']);
      },
      error: async (err) => {
        console.error('❌ Error submitting ulasan:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Gagal Menghantar',
          text: err?.error?.error || 'Ralat semasa menghantar penilaian',
        });
      },
    });
  }

  // ⭐ PPSM approval (Sah button)
  async onSahkanPenilaian(): Promise<void> {
    // Confirm approval
    const result = await Swal.fire({
      icon: 'question',
      title: 'Sahkan Penilaian?',
      text: 'Penilaian akan disahkan. Tindakan ini tidak boleh diundur.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Sahkan',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    const request: SahkanPenilaianRequest = {
      idSkt: this.idSkt,
    };

    console.log('✅ PPSM sahkan penilaian:', request);

    this.ulasanService.sahkanPenilaian(request).subscribe({
      next: async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berjaya Disahkan',
          text: `Penilaian untuk ${
            this.pegawai?.nama || 'pegawai'
          } telah berjaya disahkan.`,
        });

        // Navigate back to list
        this.router.navigate(['/senarai-penilaian']);
      },
      error: async (err) => {
        console.error('❌ Error sahkan penilaian:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Gagal Mengesahkan',
          text: err?.error?.error || 'Ralat semasa mengesahkan penilaian',
        });
      },
    });
  }
}
