import { Component, inject, OnInit } from '@angular/core';
import { SasaranAktivitiRow, SasaranKerjaService } from '../services/sasaran-kerja.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleStateService } from '../services/role-state.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PenilaianService } from '../services/penilaian.service';
import { PydService } from '../services/pyd.service';

@Component({
  selector: 'app-sasaran-pp',
  imports: [ButtonModule, TableModule, TagModule],
  templateUrl: './sasaran-pp.component.html',
  styleUrl: './sasaran-pp.component.css'
})
export class SasaranPpComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private skService = inject(SasaranKerjaService);

  idSkt: number | null = null;
  idPyd: number | null = null;
  tahunPenilaian: number | null = null;
  namaKategoriPenilaian: string | null = null;

  rows: SasaranAktivitiRow[] = [];
  loading = false;

  constructor(
    private roleState: RoleStateService,
    private penilaian: PenilaianService,
    private pydService: PydService
  ) {}

  ngOnInit(): void {
  // Step 1: Get idPyd from RoleStateService
  this.roleState.idPyd$.subscribe(id => {
    this.idPyd = id;
    console.log("Received idPyd:", this.idPyd);

    if (this.idPyd) {
      this.penilaian.getIdSktByIdPyd(this.idPyd).subscribe({
        next: (res: { idSkt: number }) => {
          this.idSkt = res.idSkt;
          console.log("idSkt from backend:", this.idSkt);
          this.loadAktivitiRows();
        },
        error: (err: any) => console.error("Failed to fetch idSkt:", err)
      });
    }
  });

  // Step 2: Subscribe to Tahun & Kategori
  this.pydService.tahunPenilaian$.subscribe(tahun => {
    this.tahunPenilaian = tahun;
  });

  this.pydService.kategoriPenilaian$.subscribe(kat => {
    this.namaKategoriPenilaian = kat;
  });
}

  private loadAktivitiRows(): void {
    if (this.idSkt != null) {
      this.loading = true;
      this.skService.getAktivitiRows(this.idSkt).subscribe({
        next: (r: SasaranAktivitiRow[]) => {
          this.rows = r;
          this.loading = false;
          console.log("Loaded aktiviti rows:", r);
        },
        error: (e: any) => {
          console.error(e);
          this.loading = false;
        }
      });
    }
  }

  // onButtonClick(): void {
  //   this.router.navigate(['/tambah-aktiviti'], {
  //     state: {
  //       idSkt: this.idSkt,
  //       tahunPenilaian: this.tahunPenilaian,
  //       namaKategoriPenilaian: this.namaKategoriPenilaian
  //     }
  //   });
  // }
}