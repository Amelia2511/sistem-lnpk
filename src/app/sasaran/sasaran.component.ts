import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SasaranKerjaService, SasaranAktivitiRow } from '../services/sasaran-kerja.service';
import { AuthService } from '../auth/auth.service';
import { userDTO } from '../model/userDTO.model';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import Swal from 'sweetalert2';
import { SasaranTableComponent } from '../sasaran-table/sasaran-table.component';
import { AktivitiGroup, Petunjuk } from '../model/aktiviti-group.model';

@Component({
  selector: 'app-sasaran',
  standalone: true,
  imports: [CommonModule, ButtonModule, FileUploadModule, TagModule, CardModule, SasaranTableComponent],
  templateUrl: './sasaran.component.html',
  styleUrl: './sasaran.component.css'
})
export class SasaranComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private skService = inject(SasaranKerjaService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  idSkt!: number | null;
  tahunPenilaian: number | null = null;
  namaKategoriPenilaian: string | null = null;
  namaStatus: string | null = null;
  idStatus: number | null = null;

  user: userDTO = {} as userDTO;
  noKpPpp: string | null = null;
  isPpp: boolean = false;

  rows: SasaranAktivitiRow[] = [];
  loading = false;

  groups: AktivitiGroup[] = [];
  pagedGroups: AktivitiGroup[] = [];

  pageSize = 10;
  first = 0;

  ngOnInit() {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log('👤 Logged in user:', this.user);
      }
    });

    const meta = this.route.snapshot.data['skt'] as {
      idSkt: number;
      tahunPenilaian: number | null;
      namaKategoriPenilaian: string | null
    } | null;

    if (!meta) {
      console.log("No meta found");
      return;
    }

    this.idSkt = meta.idSkt;
    this.tahunPenilaian = meta.tahunPenilaian;
    this.namaKategoriPenilaian = meta.namaKategoriPenilaian;

    if (this.idSkt) {
      this.loading = true;
      this.loadSasaranDetails();

      this.skService.getAktivitiRows(this.idSkt).subscribe({
        next: r => {
          this.rows = r ?? [];
          this.buildGroups();
          this.loading = false;
        },
        error: e => {
          console.error(e);
          this.loading = false;
        }
      });
    }
  }

  loadSasaranDetails(): void {
    if (!this.idSkt) return;

    this.skService.getSasaranById(this.idSkt).subscribe({
      next: (data) => {
        this.tahunPenilaian = data.tahunPenilaian;
        this.namaKategoriPenilaian = data.namaKategoriPenilaian;
        this.namaStatus = data.namaStatus ?? null;
        this.idStatus = data.idStatus;
        this.noKpPpp = data.noKpPpp;

        this.isPpp = this.user.noKP === this.noKpPpp;

        console.log('🔍 Is user the PPP?', this.isPpp);
        console.log('🔍 User noKP:', this.user.noKP);
        console.log('🔍 PPP noKP:', this.noKpPpp);
      },
      error: (err) => {
        console.error('❌ Error loading sasaran details:', err);
      }
    });
  }

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

  private sliceGroups() {
    const start = this.first;
    const end = start + this.pageSize;
    this.pagedGroups = this.groups.slice(start, end);
  }

  onButtonClick() {
    this.router.navigate(['/tambah-aktiviti'], {
      state: {
        idSkt: this.idSkt,
        tahunPenilaian: this.tahunPenilaian,
        namaKategoriPenilaian: this.namaKategoriPenilaian
      }
    });
  }

  onPageChange(e: { first: number; rows: number }) {
    this.first = e.first;
    this.pageSize = e.rows;
    this.sliceGroups();
  }

  private removeAktivitiLocally(idAktiviti: number) {
    this.rows = this.rows.filter(r => r.idAktiviti !== idAktiviti);
    this.groups = this.groups.filter(g => g.idAktiviti !== idAktiviti);

    const total = this.groups.length;
    if (total === 0) {
      this.first = 0;
    } else if (this.first >= total) {
      const lastPageStart = Math.floor((total - 1) / this.pageSize) * this.pageSize;
      this.first = Math.max(0, lastPageStart);
    }

    this.sliceGroups();
    this.cdr.markForCheck();
  }

  onEditAktiviti(group: AktivitiGroup) {
    this.router.navigate(['/aktiviti/edit', group.idAktiviti], {
      queryParams: { idSkt: this.idSkt },
      state: {
        idSkt: this.idSkt,
        tahunPenilaian: this.tahunPenilaian,
        namaKategoriPenilaian: this.namaKategoriPenilaian
      }
    });
  }

  onDeleteAktiviti(group: AktivitiGroup) {
    const id = group.idAktiviti;
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
        this.removeAktivitiLocally(id);
        Swal.fire({ icon: 'success', title: 'Aktiviti dipadam' });
      } catch (e: any) {
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: 'Gagal memadam',
          text: e?.error?.error ?? 'Ralat semasa memadam aktiviti.'
        });
      }
    });
  }

  get editable(): boolean {
    const status = (this.namaStatus || '').toLowerCase();
    return status === 'aktif' || status === 'draf';
  }

  get submitted(): boolean {
    return (this.namaStatus || '').toLowerCase() === 'pengesahan ppp';
  }

  async onHantar() {
    if (!this.idSkt) return;
    try {
      await this.skService.hantarSasaran(this.idSkt).toPromise();

      await Swal.fire({
        icon: 'success',
        title: `Sasaran Kerja Tahunan ${this.tahunPenilaian ?? '-'} ${this.namaKategoriPenilaian ?? '-'}`,
        text: 'anda telah berjaya dihantar untuk semakan PPP'
      });

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

      await Swal.fire({
        icon: 'success',
        title: `Sasaran Kerja Tahunan ${this.tahunPenilaian ?? '-'} ${this.namaKategoriPenilaian ?? '-'}`,
        text: 'telah disahkan'
      });

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
}
