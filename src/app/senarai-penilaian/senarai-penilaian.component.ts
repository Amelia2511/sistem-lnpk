import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-senarai-penilaian',
  imports: [ButtonModule, CardModule, DialogModule, TableModule, TagModule],
  templateUrl: './senarai-penilaian.component.html',
  styleUrl: './senarai-penilaian.component.css'
})
export class SenaraiPenilaianComponent {
  private router = inject(Router);

  onButtonClick() {
    this.router.navigate(['/penilaian']);
  }

  products = [
    {
      tahunPenilaian: 2025,
      kategoriPenilaian: 'Semula',
      status: 'Penilaian PPP'
    },
    {
      tahunPenilaian: 2025,
      kategoriPenilaian: 'Utama',
      status: 'Penilaian Selesai PPSM'
    },
    {
      tahunPenilaian: 2024,
      kategoriPenilaian: 'Semula',
      status: 'Penilaian Selesai PPSM'
    },
    {
      tahunPenilaian: 2024,
      kategoriPenilaian: 'Utama',
      status: 'Penilaian Selesai PPSM'
    },
    {
      tahunPenilaian: 2023,
      kategoriPenilaian: 'Semula',
      status: 'Penilaian Selesai PPSM'
    },
    {
      tahunPenilaian: 2023,
      kategoriPenilaian: 'Utama',
      status: 'Penilaian Selesai PPSM'
    },
  ];
}
