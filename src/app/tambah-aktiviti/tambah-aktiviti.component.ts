import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface PetunjukPrestasiRow {
  jenis: string;
  keterangan: string;
  sasaranKerja: string;
  pencapaianSebenar: string;
  ulasan: string;
}

interface Lampiran {
  file: File;
  namaFail: string;
}

@Component({
  selector: 'app-tambah-aktiviti',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, FileUploadModule, InputTextModule, SelectModule, TableModule, TextareaModule, HttpClientModule],
  templateUrl: './tambah-aktiviti.component.html',
  styleUrls: ['./tambah-aktiviti.component.css']
})
export class TambahAktivitiComponent {
  visible: boolean = false;
  namaAktiviti: string = '';

  // Dialog fields
  selectedPetunjukJenis: string = '';
  keterangan: string = '';
  sasaranKerjaDialog: string = '';
  pencapaianSebenarDialog: string = '';
  ulasanDialog: string = '';

  petunjukPrestasiOptions = [
    { label: 'Kos', value: 'Kos' },
    { label: 'Kualiti', value: 'Kualiti' },
    { label: 'Kuantiti', value: 'Kuantiti' },
    { label: 'Masa', value: 'Masa' },
  ];

  petunjukPrestasiRows: PetunjukPrestasiRow[] = [];

  uploadedFiles: Lampiran[] = [];

  private router = inject(Router);
  private http = inject(HttpClient);

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

  cancelPetunjukPrestasi() {
    this.visible = false;
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push({ file, namaFail: file.name });
    }
  }

  async onSubmit() {
    // Step 1: upload files first
    const lampiranUploadPromises = this.uploadedFiles.map(async (f) => {
      const formData = new FormData();
      formData.append('file', f.file);
      const res: any = await this.http.post('/api/files/upload', formData).toPromise();
      return { namaFail: f.namaFail, failPath: res.path };
    });

    const lampiran = await Promise.all(lampiranUploadPromises);

    // Step 2: send Aktiviti + PetunjukPrestasi + Lampiran to backend
    const payload = {
      namaAktiviti: this.namaAktiviti,
      petunjukPrestasi: this.petunjukPrestasiRows,
      lampiran
    };

    this.http.post('/api/aktiviti/tambah', payload).subscribe({
      next: (res) => {
        console.log('Aktiviti saved', res);
        // redirect or clear form
      },
      error: (err) => console.error(err)
    });
  }
}
