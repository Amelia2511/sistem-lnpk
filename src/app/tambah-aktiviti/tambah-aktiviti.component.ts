import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface PetunjukPrestasi {
  label: string;
  value: string;
}

@Component({
  selector: 'app-tambah-aktiviti',
  imports: [InputTextModule, SelectModule],
  templateUrl: './tambah-aktiviti.component.html',
  styleUrl: './tambah-aktiviti.component.css'
})
export class TambahAktivitiComponent {
    petunjukPrestasiOptions: PetunjukPrestasi[] = [
    { label: 'Kualiti', value: 'kualiti' },
    { label: 'Kuantiti', value: 'kuantiti' },
    { label: 'Masa', value: 'masa' },
    { label: 'Kos', value: 'kos' }
  ];

  selectedPetunjukPrestasi: string | null = null;

  onSelectionChange(event: any) {
    console.log('Selected:', event.value);
  }

}
