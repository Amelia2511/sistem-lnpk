import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-senarai-penilaian-pyd',
  imports: [ButtonModule, CardModule, TableModule, TagModule],
  templateUrl: './senarai-penilaian-pyd.component.html',
  styleUrl: './senarai-penilaian-pyd.component.css'
})
export class SenaraiPenilaianPydComponent {
  penilaians = [];
}
