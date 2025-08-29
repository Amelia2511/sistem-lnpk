import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-senarai-sasaran',
  imports: [ButtonModule, CardModule, TableModule, TagModule],
  templateUrl: './senarai-sasaran.component.html',
  styleUrl: './senarai-sasaran.component.css'
})
export class SenaraiSasaranComponent {
  private router = inject(Router);

  onButtonClick() {
    this.router.navigate(['/sasaran']);
  }

  products = [
    {
      tahunPenilaian: 2025,
      kategoriPenilaian: 'Semula',
      status: 'Draf'
    },
    {
      tahunPenilaian: 2025,
      kategoriPenilaian: 'Utama',
      status: 'Sah'
    },
    {
      tahunPenilaian: 2024,
      kategoriPenilaian: 'Semula',
      status: 'Sah'
    },
    {
      tahunPenilaian: 2024,
      kategoriPenilaian: 'Utama',
      status: 'Sah'
    },
    {
      tahunPenilaian: 2023,
      kategoriPenilaian: 'Semula',
      status: 'Sah'
    },
    {
      tahunPenilaian: 2023,
      kategoriPenilaian: 'Utama',
      status: 'Sah'
    },
  ];
}
