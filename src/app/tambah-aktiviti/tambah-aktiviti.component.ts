import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';
import { AttachmentService } from '../services/attachment.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { attachment } from '../model/attachment.model';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface Lampiran {
  file: File;
  namaFail: string;
  lampiranId?: number;
}

interface UploadedLampiran {
  namaFail: string;
  lampiranId: number;
}

interface PetunjukPrestasiRow {
  jenis: string;
  keterangan: string;
  sasaranKerja: string;
  pencapaianSebenar: string;
  ulasan: string;
}

@Component({
  selector: 'app-tambah-aktiviti',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, DialogModule, FileUploadModule,
    InputTextModule, SelectModule, TableModule, TextareaModule, HttpClientModule
  ],
  templateUrl: './tambah-aktiviti.component.html',
  styleUrls: ['./tambah-aktiviti.component.css']
})
export class TambahAktivitiComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  backendUrl = 'http://localhost:5015'; // your backend

  idSkt!: number | null;
  tahunPenilaian?: number | null;
  namaKategoriPenilaian?: string | null;

  ngOnInit() {
    this.idSkt = history.state?.idSkt ?? null;
    this.tahunPenilaian = history.state?.tahunPenilaian ?? null;
    this.namaKategoriPenilaian = history.state?.namaKategoriPenilaian ?? null;
  }

  namaAktiviti = '';
  petunjukPrestasiRows: PetunjukPrestasiRow[] = [];
  uploadedFiles: Lampiran[] = [];
  uploadedLampiran: UploadedLampiran[] = [];
  file: File | null = null;
  atts: attachment = {} as attachment;

  visible = false;
  selectedPetunjukJenis = '';
  keterangan = '';
  sasaranKerjaDialog = '';
  pencapaianSebenarDialog = '';
  ulasanDialog = '';

  constructor(public attService: AttachmentService) {
    this.idSkt = (history.state?.idSkt ?? null);
  }

  petunjukPrestasiOptions = [
    { label: 'Kos', value: 'Kos' },
    { label: 'Kualiti', value: 'Kualiti' },
    { label: 'Kuantiti', value: 'Kuantiti' },
    { label: 'Masa', value: 'Masa' }
  ];

  showDialog() {
    this.visible = true;
    this.selectedPetunjukJenis = '';
    this.keterangan = '';
    this.sasaranKerjaDialog = '';
    this.pencapaianSebenarDialog = '';
    this.ulasanDialog = '';
  }

  savePetunjukPrestasi() {
    this.petunjukPrestasiRows.push({
      jenis: this.selectedPetunjukJenis,
      keterangan: this.keterangan,
      sasaranKerja: this.sasaranKerjaDialog,
      pencapaianSebenar: this.pencapaianSebenarDialog,
      ulasan: this.ulasanDialog
    });
    this.visible = false;
  }

  cancelPetunjukPrestasi() { this.visible = false; }

  onFileSelected(event: any) {
  const selectedFile: File = event.target.files[0];
  if (!selectedFile) return;

  if (selectedFile.size > 12 * 1024 * 1024) {
    Swal.fire({
      icon: 'warning',
      title: 'Fail terlalu besar',
      text: 'Saiz fail tidak boleh melebihi 12 MB'
    });
    return;
  }

  this.file = selectedFile;
  this.atts.namaFail = selectedFile.name;

  console.log('Fail dipilih:', this.file);
}

  // --- FileUpload handlers ---
  handleFileSelect(event: any) {
    if (!event?.files || event.files.length === 0) return; // guard for Choose without selection
    for (const f of event.files) {
      if (!f) continue;
      this.uploadedFiles.push({ file: f, namaFail: f.name });
    }
    console.log('Files selected:', this.uploadedFiles);
  }

  async onCustomUpload(event: any) {
    // Guard against missing or empty files
    if (!event || !event.files || event.files.length === 0) {
      console.log('No files to upload');
      return;
    }
  }

  onCancel() {
    this.router.navigate(['/sasaran'], {
      queryParams: { idSkt: this.idSkt },
      state: {
        idSkt: this.idSkt,
        tahunPenilaian: this.tahunPenilaian,
        namaKategoriPenilaian: this.namaKategoriPenilaian
      }
    });
  }


  // onCancel() {
  //   if (!this.idSkt) {
  //     // Fallback: just go to /sasaran without id (or to list)
  //     this.router.navigate(['/sasaran']);
  //     return;
  //   }
  //   this.router.navigate(['/sasaran'], {
  //     queryParams: { idSkt: this.idSkt },
  //     state: {
  //       idSkt: this.idSkt,
  //       tahunPenilaian: this.tahunPenilaian,
  //       namaKategoriPenilaian: this.namaKategoriPenilaian
  //      }
  //   });
  // }

  async onSubmit() {
    if (!this.namaAktiviti) {
      await Swal.fire({ icon: 'warning', title: 'Nama Aktiviti diperlukan', text: 'Sila isi Nama Aktiviti sebelum simpan.' });
      return;
    }
    if (!this.idSkt) {
      await Swal.fire({ icon: 'warning', title: 'Rujukan SKT hilang', text: 'Tidak dapat mengenal pasti SKT untuk Aktiviti ini.' });
      return;
    }

    try {
      // (optional) upload lampiran...
      const payload = {
        idSkt: this.idSkt,
        namaAktiviti: this.namaAktiviti,
        petunjukPrestasi: this.petunjukPrestasiRows,
        lampiran: this.uploadedLampiran
      };

      await this.http.post(`${this.backendUrl}/api/aktiviti/tambah`, payload).toPromise();

      // success modal
      await Swal.fire({ icon: 'success', title: 'Aktiviti berjaya disimpan', confirmButtonText: 'OK' });

      this.router.navigate(['/sasaran'], {
        queryParams: { idSkt: this.idSkt },
        state: {
          idSkt: this.idSkt,
          tahunPenilaian: this.tahunPenilaian,
          namaKategoriPenilaian: this.namaKategoriPenilaian
        }
      });
    } catch (err: any) {
      console.error(err);
      await Swal.fire({ icon: 'error', title: 'Simpan gagal', text: err?.error?.error ?? 'Ralat berlaku semasa menyimpan Aktiviti.' });
    }
  }


  // async onSubmit() {
  //   if (!this.namaAktiviti) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Nama Aktiviti diperlukan',
  //       text: 'Sila isi Nama Aktiviti sebelum simpan.'
  //     });
  //     return;
  //   }
  //   if (!this.idSkt) {
  //     await Swal.fire({
  //       icon: 'warning',
  //       title: 'Rujukan SKT hilang',
  //       text: 'Tidak dapat mengenal pasti SKT untuk Aktiviti ini.'
  //     });
  //     return;
  //   }

  //   try {
  //     // (optional) upload lampiran
  //     if (this.file) {
  //       const lampiranId = await firstValueFrom(this.attService.postAttachment(this.atts));
  //       await firstValueFrom(this.attService.postFile(lampiranId, this.file));
  //       this.uploadedLampiran.push({ namaFail: this.file.name, lampiranId });
  //     }

  //     const payload = {
  //       idSkt: this.idSkt,
  //       namaAktiviti: this.namaAktiviti,
  //       petunjukPrestasi: this.petunjukPrestasiRows,
  //       lampiran: this.uploadedLampiran
  //     };

  //     await this.http.post(`${this.backendUrl}/api/aktiviti/tambah`, payload).toPromise();

  //     // clear local state (optional)
  //     this.namaAktiviti = '';
  //     this.petunjukPrestasiRows = [];
  //     this.uploadedFiles = [];
  //     this.uploadedLampiran = [];

  //     // success → show Swal, then navigate back to that SKT’s page
  //     await Swal.fire({
  //       icon: 'success',
  //       title: 'Aktiviti berjaya disimpan',
  //       confirmButtonText: 'Kembali ke Laporan Pencapaian Sasaran'
  //     });

  //     this.router.navigate(['/sasaran'], {
  //       queryParams: { idSkt: this.idSkt },
  //       state: {
  //         idSkt: this.idSkt,
  //         tahunPenilaian: this.tahunPenilaian,
  //         namaKategoriPenilaian: this.namaKategoriPenilaian
  //       }
  //     });

  //   } catch (err: any) {
  //     console.error(err);
  //     await Swal.fire({
  //       icon: 'error',
  //       title: 'Simpan gagal',
  //       text: err?.error?.error ?? 'Ralat berlaku semasa menyimpan Aktiviti.'
  //     });
  //   }
  // }
}
