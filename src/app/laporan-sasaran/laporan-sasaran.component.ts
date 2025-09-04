import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-laporan-sasaran',
  imports: [TableModule, TagModule],
  templateUrl: './laporan-sasaran.component.html',
  styleUrl: './laporan-sasaran.component.css'
})
export class LaporanSasaranComponent {

}
