import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';

interface PetunjukPrestasi {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tambah-aktiviti',
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, FileUploadModule, InputTextModule, SelectModule, TableModule, TextareaModule],
  templateUrl: './tambah-aktiviti.component.html',
  styleUrl: './tambah-aktiviti.component.css'
})
export class TambahAktivitiComponent {
  visible: boolean = false;
  uploadedFiles: any[] = [];

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log('Files uploaded:', this.uploadedFiles);
  }

  onFileSelect(event: any) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log('Files selected:', this.uploadedFiles);
  }

  showDialog() {
    this.visible = true;
  }

  private router = inject(Router);

  onButtonClick() {
    this.router.navigate(['/tambah-aktiviti']);
  }

  petunjukPrestasiOptions: PetunjukPrestasi[] = [
    { label: 'Kos', value: 'kos' },
    { label: 'Kualiti', value: 'kualiti' },
    { label: 'Kuantiti', value: 'kuantiti' },
    { label: 'Masa', value: 'masa' },
  ];

  selectedPetunjukPrestasi: string | null = null;

  onSelectionChange(event: any) {
    console.log('Selected:', event.value);
  }

  products = [
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
    {
      jenisPetunjuk: 2025,
      sasaranKerja: 'Semula',
      pencapaianSebenar: 'Draf',
      ulasan: 'lsdkhfajklsdhfjlk'
    },
  ];

}
