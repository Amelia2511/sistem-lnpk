import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';

// Selected file with File object
interface Lampiran {
  file: File;
  namaFail: string;
  lampiranId?: number;
}

// For payload to backend after upload
interface UploadedLampiran {
  namaFail: string;
  lampiranId: number;
}

// Petunjuk Prestasi row
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
  backendUrl = 'https://localhost:44324'; // Your backend URL

  // Form fields
  namaAktiviti = '';
  petunjukPrestasiRows: PetunjukPrestasiRow[] = [];
  uploadedFiles: Lampiran[] = [];
  uploadedLampiran: UploadedLampiran[] = [];

  // Dialog
  visible = false;
  selectedPetunjukJenis = '';
  keterangan = '';
  sasaranKerjaDialog = '';
  pencapaianSebenarDialog = '';
  ulasanDialog = '';

  petunjukPrestasiOptions = [
    { label: 'Kos', value: 'Kos' },
    { label: 'Kualiti', value: 'Kualiti' },
    { label: 'Kuantiti', value: 'Kuantiti' },
    { label: 'Masa', value: 'Masa' }
  ];

  // --- Petunjuk Prestasi Dialog ---
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

  // --- Lampiran File Handling ---
  handleFileSelect(event: any) {
    if (!event || !event.files || event.files.length === 0) {
      console.log('No files selected');
      return; // User clicked Choose but didn't select any files
    }

    for (let f of event.files) {
      if (!f) continue; // guard against undefined
      this.uploadedFiles.push({ file: f, namaFail: f.name });
    }
    console.log('Files selected:', this.uploadedFiles);
  }

  async onCustomUpload(event: any) {
    if (!event || !event.files || event.files.length === 0) {
      console.log('No files to upload');
      return; // User clicked Upload without files
    }

    this.uploadedLampiran = [];

    for (const f of event.files) {
      if (!f) continue;

      // Step 1: Save metadata
      const lampiranIdResponse: number | undefined = await this.http.post<number>(
        `${this.backendUrl}/api/lampiran/metadata`,
        { NamaFail: f.name }
      ).toPromise();

      if (lampiranIdResponse === undefined || lampiranIdResponse === null) {
        throw new Error(`Lampiran ID not returned for file: ${f.name}`);
      }

      // Step 2: Upload actual file
      const formData = new FormData();
      formData.append('file', f, f.name);
      await this.http.post(`${this.backendUrl}/api/lampiran/${lampiranIdResponse}`, formData).toPromise();

      // Add to uploadedLampiran array for payload
      this.uploadedLampiran.push({ namaFail: f.name, lampiranId: lampiranIdResponse });

      // Also store lampiranId in uploadedFiles object
      const uf = this.uploadedFiles.find(x => x.file === f);
      if (uf) uf.lampiranId = lampiranIdResponse;
    }

    if (event.clear) event.clear();
    console.log('All files uploaded:', this.uploadedLampiran);
  }

  // --- Submit Aktiviti ---
  async onSubmit() {
    if (!this.namaAktiviti) {
      alert('Nama Aktiviti is required');
      return;
    }

    try {
      // Ensure files are uploaded before submitting
      if (this.uploadedFiles.length && this.uploadedLampiran.length === 0) {
        alert('Please upload selected Lampiran files first');
        return;
      }

      // Prepare payload
      const payload = {
        namaAktiviti: this.namaAktiviti,
        petunjukPrestasi: this.petunjukPrestasiRows,
        lampiran: this.uploadedLampiran
      };

      // Submit Aktiviti
      const response = await this.http.post(`${this.backendUrl}/api/aktiviti/tambah`, payload).toPromise();
      console.log('Aktiviti saved successfully:', response);
      alert('Aktiviti saved successfully!');

      // Reset form
      this.namaAktiviti = '';
      this.petunjukPrestasiRows = [];
      this.uploadedFiles = [];
      this.uploadedLampiran = [];
    } catch (err) {
      console.error('Error submitting Aktiviti:', err);
      alert('Error submitting Aktiviti. Check console.');
    }
  }
}
