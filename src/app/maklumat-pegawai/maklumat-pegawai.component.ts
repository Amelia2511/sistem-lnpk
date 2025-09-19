import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";

@Component({
  selector: 'app-maklumat-pegawai',
  imports: [CardModule, TableModule],
  templateUrl: './maklumat-pegawai.component.html',
  styleUrl: './maklumat-pegawai.component.css'
})
export class MaklumatPegawaiComponent {
  products = [
    {
      label: 'No Kad Pengenalan',
      label2: '050816-14-0208'
    },
    {
      label: 'Skim Perkhidmatan',
      label2: 'Pegawai IT'
    },
    {
      label: 'Gred Hakiki',
      label2: 'F44'
    },
    {
      label: 'Tempat Bertugas',
      label2: 'Unit Teknologi Maklumat'
    },
    {
      label: 'Jawatan',
      label2: 'Pegawai IT' 
    },
    {
      label: 'Tarikh Mula Kontrak',
      label2: '18 November 2022'
    },
    {
      label: 'Tarikh Akhir Kontrak',
      label2: '18 November 2026'
    }
  ]
}
