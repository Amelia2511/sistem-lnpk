// pages/edit-aktiviti/edit-aktiviti.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SasaranKerjaService } from '../services/sasaran-kerja.service';

interface PetunjukPrestasiRow {
  jenis: string;
  keterangan: string;
  sasaranKerja: string;
  pencapaianSebenar: string;
  ulasan: string;
}

@Component({
  selector: 'app-edit-aktiviti',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, FileUploadModule, InputTextModule, SelectModule, TableModule, TextareaModule],
  templateUrl: './edit-aktiviti.component.html'
})
export class EditAktivitiComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private skService = inject(SasaranKerjaService);

  backendUrl = 'http://localhost:5015';

  idAktiviti!: number;
  idSkt!: number | null;

  // page title
  title = 'Edit Aktiviti';

  // fields (same as Tambah)
  namaAktiviti = '';
  petunjukPrestasiRows: PetunjukPrestasiRow[] = [];
  petunjukSubmitted = false;

  // dialog fields
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

  ngOnInit() {
    this.idAktiviti = Number(this.route.snapshot.paramMap.get('id'));
    this.idSkt = Number(this.route.snapshot.queryParamMap.get('idSkt')) || (history.state?.idSkt ?? null);

    // Load existing aktiviti
    this.skService.getAktivitiDetail(this.idAktiviti).subscribe({
      next: (res) => {
        this.namaAktiviti = res.namaAktiviti ?? '';
        this.petunjukPrestasiRows = (res.petunjuk || []).map(p => ({
          jenis: p.jenis ?? '',
          keterangan: p.keterangan ?? '',
          sasaranKerja: (p.sasaranKerja ?? '').toString(),
          pencapaianSebenar: (p.pencapaianSebenar ?? '').toString(),
          ulasan: p.ulasan ?? ''
        }));
      },
      error: (e) => console.error(e)
    });
  }

  editingPetunjukIndex: number | null = null;

  showDialog() {
    this.visible = true;
    this.petunjukSubmitted = false;
    this.editingPetunjukIndex = null;
    this.selectedPetunjukJenis = '';
    this.keterangan = '';
    this.sasaranKerjaDialog = '';
    this.pencapaianSebenarDialog = '';
    this.ulasanDialog = '';
  }

  onEditPetunjuk(row: PetunjukPrestasiRow, index: number) {
  this.visible = true;
  this.petunjukSubmitted = false;
  this.editingPetunjukIndex = index; // <— edit mode

  this.selectedPetunjukJenis = row.jenis;
  this.keterangan = row.keterangan;
  this.sasaranKerjaDialog = row.sasaranKerja;
  this.pencapaianSebenarDialog = row.pencapaianSebenar;
  this.ulasanDialog = row.ulasan;
}

// Remove a row
onDeletePetunjuk(index: number) {
  this.petunjukPrestasiRows.splice(index, 1);
}

// Keep your existing helper
isInvalid(ctrl: NgModel | null | undefined): boolean {
  return !!ctrl && !!ctrl.invalid && (ctrl.touched || this.petunjukSubmitted);
}

// SAVE: now supports add/edit depending on editingPetunjukIndex
savePetunjukPrestasi(
  jenisCtrl?: NgModel,
  keteranganCtrl?: NgModel,
  sasaranCtrl?: NgModel,
  pencapaianCtrl?: NgModel
) {
  this.petunjukSubmitted = true;

  if (
    this.isInvalid(jenisCtrl) ||
    this.isInvalid(keteranganCtrl) ||
    this.isInvalid(sasaranCtrl) ||
    this.isInvalid(pencapaianCtrl)
  ) {
    return;
  }

  const payload: PetunjukPrestasiRow = {
    jenis: this.selectedPetunjukJenis,
    keterangan: this.keterangan.trim(),
    sasaranKerja: this.sasaranKerjaDialog.trim(),
    pencapaianSebenar: this.pencapaianSebenarDialog.trim(),
    ulasan: (this.ulasanDialog || '').trim()
  };

  if (this.editingPetunjukIndex !== null) {
    // EDIT: replace row at index
    this.petunjukPrestasiRows[this.editingPetunjukIndex] = payload;
  } else {
    // ADD: push new row
    this.petunjukPrestasiRows.push(payload);
  }

  // reset dialog state
  this.visible = false;
  this.petunjukSubmitted = false;
  this.editingPetunjukIndex = null;
  this.selectedPetunjukJenis = '';
  this.keterangan = '';
  this.sasaranKerjaDialog = '';
  this.pencapaianSebenarDialog = '';
  this.ulasanDialog = '';
}

cancelPetunjukPrestasi() {
  this.visible = false;
  this.petunjukSubmitted = false;
  this.editingPetunjukIndex = null;
}

  removePetunjuk(index: number) {
    this.petunjukPrestasiRows.splice(index, 1);
  }

  async onSave() {
    if (!this.namaAktiviti) {
      await Swal.fire({ icon: 'warning', title: 'Nama Aktiviti diperlukan' });
      return;
    }

    // build body for PUT
    const body = {
      namaAktiviti: this.namaAktiviti,
      petunjuk: this.petunjukPrestasiRows.map(p => ({
        jenis: p.jenis,
        keterangan: p.keterangan,
        sasaranKerja: Number(p.sasaranKerja),
        pencapaianSebenar: Number(p.pencapaianSebenar),
        ulasan: p.ulasan
      }))
    };

    try {
      await this.skService.updateAktiviti(this.idAktiviti, body).toPromise();
      await Swal.fire({ icon: 'success', title: 'Aktiviti berjaya dikemaskini' });
      this.router.navigate(['/sasaran'], {
        queryParams: { idSkt: this.idSkt },
        state: { idSkt: this.idSkt }
      });
    } catch (e: any) {
      console.error(e);
      await Swal.fire({ icon: 'error', title: 'Kemaskini gagal', text: e?.error?.error ?? 'Ralat semasa kemaskini.' });
    }
  }

  onCancel() {
    this.router.navigate(['/sasaran'], {
      queryParams: { idSkt: this.idSkt },
      state: { idSkt: this.idSkt }
    });
  }
}

