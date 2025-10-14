import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SasaranAktivitiRow, SasaranKerjaService } from '../services/sasaran-kerja.service';
import Swal from 'sweetalert2';

type GroupMeta = Record<number, { start: number; size: number }>;

@Component({
  selector: 'app-sasaran',
  imports: [ButtonModule, TableModule, TagModule, TooltipModule],
  templateUrl: './sasaran.component.html',
  styleUrl: './sasaran.component.css'
})
export class SasaranComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private skService = inject(SasaranKerjaService);

  idSkt!: number | null;
  tahunPenilaian?: number | null = null;
  namaKategoriPenilaian?: string | null = null;

  rows: SasaranAktivitiRow[] = [];
  loading = false;
  rowGroupMeta: GroupMeta = {};

  ngOnInit() {
    // Resolver result is available on snapshot.data (or subscribe to data for reactive)
    const meta = this.route.snapshot.data['skt'] as { idSkt: number; tahunPenilaian: number | null; namaKategoriPenilaian: string | null } | null;

    if (!meta) {
      console.log("No meta found");
      // resolver already navigated if invalid; safe guard
      return;
    }

    this.idSkt = meta.idSkt;
    console.log("id skt:" , this.idSkt)
    this.tahunPenilaian = meta.tahunPenilaian;
    this.namaKategoriPenilaian = meta.namaKategoriPenilaian;

    if (this.idSkt) {
      this.loading = true;
      this.skService.getAktivitiRows(this.idSkt).subscribe({
        next: r => {
          this.rows = r ?? [];
          this.buildRowGroupMeta();       // <-- build after data loads
          this.loading = false;
        },
        error: e => { console.error(e); this.loading = false; }
      });
    }
  }

  onButtonClick() {
    // pass meta in state to make returning to /sasaran snappy
    this.router.navigate(['/tambah-aktiviti'], {
      state: {
        idSkt: this.idSkt,
        tahunPenilaian: this.tahunPenilaian,
        namaKategoriPenilaian: this.namaKategoriPenilaian
      }
    });
  }

    // Recompute when the list changes (e.g., after delete)
  private buildRowGroupMeta(): void {
    this.rowGroupMeta = {};
    // rows must be grouped by idAktiviti contiguously (API already orders; if unsure, sort here)
    // this.rows.sort((a,b) => a.idAktiviti - b.idAktiviti || a.idPprestasi - b.idPprestasi);

    this.rows.forEach((row, i) => {
      const key = row.idAktiviti;
      if (this.rowGroupMeta[key]) {
        this.rowGroupMeta[key].size++;
      } else {
        this.rowGroupMeta[key] = { start: i, size: 1 };
      }
    });
  }

  isFirstOfGroup(index: number): boolean {
    const row = this.rows[index];
    const meta = this.rowGroupMeta[row.idAktiviti];
    return meta?.start === index;
  }

  onEditAktiviti(row: SasaranAktivitiRow) {
    this.router.navigate(['/aktiviti/edit', row.idAktiviti], {
      queryParams: { idSkt: this.idSkt }, // so we can return to the right SKT
      state: {
        idSkt: this.idSkt,
        tahunPenilaian: this.tahunPenilaian,
        namaKategoriPenilaian: this.namaKategoriPenilaian
      }
    });
  }

  onDeleteAktiviti(row: SasaranAktivitiRow) {
    const id = row.idAktiviti;
    Swal.fire({
      icon: 'warning',
      title: 'Padam Aktiviti?',
      text: 'Tindakan ini tidak boleh diundur.',
      showCancelButton: true,
      confirmButtonText: 'Ya, padam',
      cancelButtonText: 'Batal'
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        await this.skService.deleteAktiviti(id).toPromise();

        // Remove all rows for this Aktiviti from the table
        this.rows = this.rows.filter(r => r.idAktiviti !== id);

        Swal.fire({ icon: 'success', title: 'Aktiviti dipadam' });
      } catch (e: any) {
        console.error(e);
        Swal.fire({ icon: 'error', title: 'Gagal memadam', text: e?.error?.error ?? 'Ralat semasa memadam aktiviti.' });
      }
    });
  }
}
