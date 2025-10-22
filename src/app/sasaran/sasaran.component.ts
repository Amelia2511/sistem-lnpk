import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SasaranKerjaService, SasaranAktivitiRow } from '../services/sasaran-kerja.service';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';

type Petunjuk = Pick<SasaranAktivitiRow,
  'idPprestasi' | 'jenisPetunjuk' | 'keterangan' | 'sasaranKerja' | 'pencapaianSebenar' | 'ulasan'>;

type AktivitiGroup = {
  idAktiviti: number;
  aktiviti: string;
  petunjuk: Petunjuk[];
};

@Component({
  selector: 'app-sasaran',
  standalone: true,
  templateUrl: './sasaran.component.html',
  // ✅ ensure these are imported somewhere (standalone or parent module)
  imports: [CommonModule, TableModule, TagModule, ButtonModule, PaginatorModule]
})
export class SasaranComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private skService = inject(SasaranKerjaService);

  idSkt!: number | null;
  tahunPenilaian: number | null = null;
  namaKategoriPenilaian: string | null = null;
  namaStatus: string | null = null;

  // raw flat rows from API
  rows: SasaranAktivitiRow[] = [];
  loading = false;

  // grouped view model
  groups: AktivitiGroup[] = [];
  pagedGroups: AktivitiGroup[] = [];

  // pagination (by Aktiviti)
  pageSize = 10;   // 10 Aktiviti per page
  first = 0;       // offset (0-based)

  ngOnInit() {
    const meta = this.route.snapshot.data['skt'] as { idSkt: number; tahunPenilaian: number | null; namaKategoriPenilaian: string | null } | null;

    if (!meta) {
      console.log("No meta found");
      // resolver already navigated if invalid; safe guard
      return;
    }

    if (!meta) return;

    this.idSkt = meta.idSkt;
    console.log("id skt:" , this.idSkt)
    this.tahunPenilaian = meta.tahunPenilaian;
    this.namaKategoriPenilaian = meta.namaKategoriPenilaian;

    if (this.idSkt) {
      this.loading = true;

      this.skService.getSasaranById(this.idSkt).subscribe(meta => {
      this.tahunPenilaian = meta.tahunPenilaian ?? null;
      this.namaKategoriPenilaian = meta.namaKategoriPenilaian ?? null;
      this.namaStatus = meta.namaStatus ?? null;
    });


      this.skService.getAktivitiRows(this.idSkt).subscribe({
        next: r => {
          this.rows = r ?? [];
          this.buildGroups();
          this.loading = false;
        },
        error: e => { console.error(e); this.loading = false; }
      });
    }
  }

  /** Build Aktiviti-level groups from flat rows */
  private buildGroups() {
    const map = new Map<number, AktivitiGroup>();
    for (const r of this.rows) {
      if (!map.has(r.idAktiviti)) {
        map.set(r.idAktiviti, { idAktiviti: r.idAktiviti, aktiviti: r.aktiviti, petunjuk: [] });
      }
      map.get(r.idAktiviti)!.petunjuk.push({
        idPprestasi: r.idPprestasi,
        jenisPetunjuk: r.jenisPetunjuk,
        keterangan: r.keterangan,
        sasaranKerja: r.sasaranKerja,
        pencapaianSebenar: r.pencapaianSebenar,
        ulasan: r.ulasan
      });
    }
    this.groups = Array.from(map.values());
    this.sliceGroups();
  }

  private cdr = inject(ChangeDetectorRef);

  /** Slice groups for current page */
  private sliceGroups() {
    const start = this.first;
    const end = start + this.pageSize;
    this.pagedGroups = this.groups.slice(start, end);
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

  /** Paginator event */
  onPageChange(e: { first: number; rows: number }) {
    this.first = e.first;
    this.pageSize = e.rows;
    this.sliceGroups();
  }

  /** After deleting an Aktiviti, refresh view model */
  private removeAktivitiLocally(idAktiviti: number) {
    // keep source-of-truth and view model in sync (immutably)
    this.rows   = this.rows.filter(r => r.idAktiviti !== idAktiviti);
    this.groups = this.groups.filter(g => g.idAktiviti !== idAktiviti);

    // if current page is past the end (e.g., deleted the last item on last page), pull back
    const total = this.groups.length;
    if (total === 0) {
      this.first = 0;
    } else if (this.first >= total) {
      const lastPageStart = Math.floor((total - 1) / this.pageSize) * this.pageSize;
      this.first = Math.max(0, lastPageStart);
    }

    this.sliceGroups();
    this.cdr.markForCheck(); // only needed if ChangeDetectionStrategy.OnPush
  }

  // === Existing handlers, unchanged in signature ===
  onEditAktiviti(group: { idAktiviti: number; aktiviti?: string } | SasaranAktivitiRow) {
    const idAktiviti = (group as any).idAktiviti;
    this.router.navigate(['/aktiviti/edit', idAktiviti], {
      queryParams: { idSkt: this.idSkt },
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
        this.removeAktivitiLocally(id);

        Swal.fire({ icon: 'success', title: 'Aktiviti dipadam' });
      } catch (e: any) {
        console.error(e);
        Swal.fire({ icon: 'error', title: 'Gagal memadam', text: e?.error?.error ?? 'Ralat semasa memadam aktiviti.' });
      }
    });
  }

  get editable(): boolean {
    // return (this.namaStatus || '').toLowerCase() === 'draf';
    return (this.namaStatus || '').toLowerCase() === 'draf';
  }

  get submitted(): boolean {
    // return (this.namaStatus || '').toLowerCase() === 'draf';
    return (this.namaStatus || '').toLowerCase() === 'pengesahan ppp';
  }

async onHantar() {
  if (!this.idSkt) return;
  try {
    await this.skService.hantarSasaran(this.idSkt).toPromise();

    // Success message as requested
    await Swal.fire({
      icon: 'success',
      title: `Sasaran Kerja Tahunan ${this.tahunPenilaian ?? '-'} ${this.namaKategoriPenilaian ?? '-'}`,
      text: 'anda telah berjaya dihantar untuk semakan PPP'
    });

    // Redirect to list
    this.router.navigate(['/senarai-sasaran']);
  } catch (e: any) {
    console.error(e);
    await Swal.fire({
      icon: 'error',
      title: 'Hantar gagal',
      text: e?.error?.error ?? 'Ralat berlaku semasa menghantar.'
    });
  }
}

async onSah() {
  if (!this.idSkt) return;
  try {
    await this.skService.sahkanSasaran(this.idSkt).toPromise();

    // Success message as requested
    await Swal.fire({
      icon: 'success',
      title: `Sasaran Kerja Tahunan ${this.tahunPenilaian ?? '-'} ${this.namaKategoriPenilaian ?? '-'}`,
      text: 'telah disahkan'
    });

    // Redirect to list
    this.router.navigate(['/senarai-sasaran']);
  } catch (e: any) {
    console.error(e);
    await Swal.fire({
      icon: 'error',
      title: 'Hantar gagal',
      text: e?.error?.error ?? 'Ralat berlaku semasa pengesahan.'
    });
  }
}

// async onTidakSah() {
//   if (!this.idSkt) return;
//   try {
//     await this.skService.hantarSasaran(this.idSkt).toPromise();

//     // Success message as requested
//     await Swal.fire({
//       icon: 'success',
//       title: `Sasaran Kerja Tahunan ${this.tahunPenilaian ?? '-'} ${this.namaKategoriPenilaian ?? '-'}`,
//       text: 'anda telah berjaya dihantar untuk semakan PPP'
//     });

//     // Redirect to list
//     this.router.navigate(['/senarai-sasaran']);
//   } catch (e: any) {
//     console.error(e);
//     await Swal.fire({
//       icon: 'error',
//       title: 'Hantar gagal',
//       text: e?.error?.error ?? 'Ralat berlaku semasa menghantar.'
//     });
//   }
// }

}

