import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Kriterium, SaveMarkahRequest } from '../model/kriterium.model';
import { AuthService } from '../auth/auth.service';
import { KriteriumService } from '../services/kriterium.service';

@Component({
  selector: 'app-senarai-soalan',
  imports: [DividerModule, InputNumberModule, TableModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './senarai-soalan.component.html',
  styleUrl: './senarai-soalan.component.css'
})
export class SenaraiSoalanComponent implements OnInit {
  @Input() idPenilaian!: number;
  @Input() idSkt!: number; // ⭐ Need SKT to load all marks
  @Input() isPpp: boolean = false;
  @Input() isPpk: boolean = false;
  @Input() isPpsm: boolean = false;

  @Output() onSaveSuccess = new EventEmitter<void>();

  kriteria: Kriterium[] = [];
  loading = true;
  skalaData = [{}];

  private _markahKeseluruhanPpsm: number | null = null;

  constructor(
    private kriteriumService: KriteriumService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.idPenilaian) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.idPenilaian = +id;
          this.loadData();
        }
      });
    } else {
      this.loadData();
    }

    console.log('🎯 SenaraiSoalanComponent - isPpp:', this.isPpp);
    console.log('🎯 SenaraiSoalanComponent - isPpk:', this.isPpk);
    console.log('🎯 SenaraiSoalanComponent - isPpsm:', this.isPpsm);
    console.log('🎯 SenaraiSoalanComponent - idSkt:', this.idSkt);
  }

  loadData(): void {
    this.loading = true;

    this.kriteriumService.getAllKriteria().subscribe({
      next: (data) => {
        this.kriteria = data;
        console.log('✅ Kriteria loaded:', this.kriteria);
        this.loadExistingMarks();
      },
      error: (err) => {
        console.error('❌ Error loading kriteria:', err);
        this.loading = false;
      }
    });
  }

  // ⭐ Load marks for BOTH PPP and PPK using idSkt
loadExistingMarks(): void {
  if (!this.idSkt) {
    console.error('❌ No idSkt provided');
    this.loading = false;
    return;
  }

  this.kriteriumService.getMarkahBySkt(this.idSkt).subscribe({
    next: (response) => {
      console.log('✅ Existing marks loaded for SKT:', response);

      // Load PPP marks
      if (response.markahPpp) {
        response.markahPpp.forEach((markah: any) => {
          this.kriteria.forEach(k => {
            const soalan = k.soalans.find(s => s.idSoalan === markah.idSoalan);
            if (soalan) {
              soalan.markahPpp = markah.markah;
            }
          });
        });
      }

      // Load PPK marks
      if (response.markahPpk) {
        response.markahPpk.forEach((markah: any) => {
          this.kriteria.forEach(k => {
            const soalan = k.soalans.find(s => s.idSoalan === markah.idSoalan);
            if (soalan) {
              soalan.markahPpk = markah.markah;
            }
          });
        });
      }

      // ⭐ Load PPSM's custom markah if exists
      if (response.markahKeseluruhanPpsm && response.markahKeseluruhanPpsm > 0) {
        this._markahKeseluruhanPpsm = response.markahKeseluruhanPpsm;
        console.log('📊 Loaded PPSM custom markah:', this._markahKeseluruhanPpsm);
      }

      // ⭐ Calculate totals after loading marks
      this.calculateMarkahKeseluruhan();

      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error loading marks:', err);
      this.loading = false;
    }
  });

  if (this.isPpsm) {
    this.loadPurata();
  }
}

loadPurata(): void {
  this.kriteriumService.getPurataBySkt(this.idSkt).subscribe({
    next: (purata) => {
      if (purata && purata.purataDiguna) {
        this._markahKeseluruhanPpsm = purata.markahPurata;
        console.log('📊 Loaded PPSM purata:', this._markahKeseluruhanPpsm);
      }
    },
    error: (err) => {
      console.log('ℹ️ No existing Purata found');
    }
  });
}

// ⭐ Add this method to recalculate totals
calculateMarkahKeseluruhan(): void {
  console.log('📊 PPP mark:', this.markahKeseluruhanPpp.toFixed(2));
  console.log('📊 PPK mark:', this.markahKeseluruhanPpk.toFixed(2));
  console.log('📊 Purata mark:', this.markahKeseluruhanPurata.toFixed(2));
  console.log('📊 PPSM mark:', this.markahKeseluruhanPpsm.toFixed(2));
}

onInputChange(): void {
  this.calculateMarkahKeseluruhan();
}
  // ⭐ Calculate PPP overall mark
  get markahKeseluruhanPpp(): number {
    const allMarks = this.kriteria.flatMap(k =>
      k.soalans.map(s => s.markahPpp || 0)
    );

    if (allMarks.length === 0) return 0;

    const total = allMarks.reduce((sum, mark) => sum + mark, 0);
    const average = (total / allMarks.length) * 10;

    return Math.round(average * 100) / 100;
  }

  // ⭐ Calculate PPK overall mark
  get markahKeseluruhanPpk(): number {
    const allMarks = this.kriteria.flatMap(k =>
      k.soalans.map(s => s.markahPpk || 0)
    );

    if (allMarks.length === 0) return 0;

    const total = allMarks.reduce((sum, mark) => sum + mark, 0);
    const average = (total / allMarks.length) * 10;

    return Math.round(average * 100) / 100;
  }

    // ⭐ Calculate Purata (average of PPP and PPK)
  get markahKeseluruhanPurata(): number {
    const ppp = this.markahKeseluruhanPpp;
    const ppk = this.markahKeseluruhanPpk;

    // If both marks exist, calculate average
    if (ppp > 0 && ppk > 0) {
      const average = (ppp + ppk) / 2;
      return Math.round(average * 100) / 100;
    }

    // If only one exists, return that one
    if (ppp > 0) return ppp;
    if (ppk > 0) return ppk;

    return 0;
  }

  // ⭐ PPSM markah - can be edited by PPSM, defaults to Purata
  get markahKeseluruhanPpsm(): number {
    // If PPSM has set a custom value, use it
    if (this._markahKeseluruhanPpsm !== null && this._markahKeseluruhanPpsm > 0) {
      return this._markahKeseluruhanPpsm;
    }

    // Otherwise, default to Purata
    return this.markahKeseluruhanPurata;
  }

  set markahKeseluruhanPpsm(value: number) {
    this._markahKeseluruhanPpsm = value;
    console.log('📊 PPSM markah set to:', value);
  }

  // onInputChange(): void {
  //   console.log('📊 PPP mark:', this.markahKeseluruhanPpp);
  //   console.log('📊 PPK mark:', this.markahKeseluruhanPpk);
  //   console.log('📊 Purata mark:', this.markahKeseluruhanPurata);
  //   console.log('📊 PPSM mark:', this.markahKeseluruhanPpsm);
  // }

  async simpan(): Promise<void> {
    // ⭐ Validate based on user role
    if (this.isPpp) {
      const missingMarks = this.kriteria.some(k =>
        k.soalans.some(s => !s.markahPpp || s.markahPpp < 1 || s.markahPpp > 10)
      );

      if (missingMarks) {
        await Swal.fire({
          icon: 'warning',
          title: 'Markah Tidak Lengkap',
          text: 'Sila isi semua markah dengan nilai antara 1 hingga 10.'
        });
        return;
      }
    }

    if (this.isPpk) {
      const missingMarks = this.kriteria.some(k =>
        k.soalans.some(s => !s.markahPpk || s.markahPpk < 1 || s.markahPpk > 10)
      );

      if (missingMarks) {
        await Swal.fire({
          icon: 'warning',
          title: 'Markah Tidak Lengkap',
          text: 'Sila isi semua markah dengan nilai antara 1 hingga 10.'
        });
        return;
      }
    }

    // ⭐ PPSM validation
  if (this.isPpsm) {
    // PPSM only validates their custom mark
    if (!this._markahKeseluruhanPpsm || this._markahKeseluruhanPpsm < 1 || this._markahKeseluruhanPpsm > 100) {
      await Swal.fire({
        icon: 'warning',
        title: 'Markah Tidak Sah',
        text: 'Sila isi markah PPSM (1-100)'
      });
      return;
    }
  } else {
    // ⭐ Validation for PPP/PPK - check individual question marks
    let hasInvalidMark = false;

    for (const k of this.kriteria) {
      for (const s of k.soalans) {
        const markah = this.isPpp ? s.markahPpp : s.markahPpk;

        if (markah === null || markah === undefined || markah < 1 || markah > s.markahMaksimum) {
          hasInvalidMark = true;
          break;
        }
      }
      if (hasInvalidMark) break;
    }

    if (hasInvalidMark) {
      await Swal.fire({
        icon: 'warning',
        title: 'Markah Tidak Sah',
        text: 'Sila isi semua markah dengan nilai antara 1 hingga markah maksimum.'
      });
      return;
    }
  }

    // ⭐ Build request based on role
let request: SaveMarkahRequest;

  if (this.isPpsm) {
    const currentUser = this.authService.getUserDTO();

    if (!currentUser) {
      await Swal.fire({
        icon: 'error',
        title: 'Ralat',
        text: 'Pengguna tidak dijumpai. Sila log masuk semula.'
      });
      return;
    }

    // PPSM saves their custom total markah
    request = {
      idSkt: this.idSkt,
      markahKeseluruhanPpsm: this._markahKeseluruhanPpsm as number,
      idPegawai: currentUser.id
    } as SaveMarkahRequest;
  } else {
    // PPP/PPK save individual question marks
    request = {
      idPenilaian: this.idPenilaian,
      markahSoalans: this.kriteria.flatMap(k =>
        k.soalans.map(s => ({
          idSoalan: s.idSoalan,
          markah: this.isPpp ? (s.markahPpp || 0) : (s.markahPpk || 0)
        }))
      ),
      jumlahMarkah: this.isPpp ? this.markahKeseluruhanPpp : this.markahKeseluruhanPpk
    } as SaveMarkahRequest;
  }

  console.log('💾 Saving marks:', request);

  this.kriteriumService.saveMarkah(request).subscribe({
    next: async () => {
      await Swal.fire({
        icon: 'success',
        title: 'Berjaya',
        text: 'Markah berjaya disimpan'
      });

      this.onSaveSuccess.emit();
    },
    error: async (err) => {
      console.error('❌ Error saving marks:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err?.error?.error || 'Ralat semasa menyimpan markah'
      });
    }
  });

  }
}
