import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SasaranAktivitiRow, SasaranKerjaService } from '../services/sasaran-kerja.service';

@Component({
  selector: 'app-sasaran',
  imports: [ButtonModule, TableModule, TagModule],
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

  ngOnInit() {
    // Resolver result is available on snapshot.data (or subscribe to data for reactive)
    const meta = this.route.snapshot.data['skt'] as { idSkt: number; tahunPenilaian: number | null; namaKategoriPenilaian: string | null } | null;

    if (!meta) {
      // resolver already navigated if invalid; safe guard
      return;
    }

    this.idSkt = meta.idSkt;
    this.tahunPenilaian = meta.tahunPenilaian;
    this.namaKategoriPenilaian = meta.namaKategoriPenilaian;

    if (this.idSkt) {
      this.loading = true;
      this.skService.getAktivitiRows(this.idSkt).subscribe({
        next: r => { this.rows = r; this.loading = false; },
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
}
