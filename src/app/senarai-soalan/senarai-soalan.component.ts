import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-senarai-soalan',
  imports: [DividerModule, InputNumberModule, TableModule],
  templateUrl: './senarai-soalan.component.html',
  styleUrl: './senarai-soalan.component.css'
})
export class SenaraiSoalanComponent {
  a1 = 1;

  // Data for the Skala table
  skalaData = [
    { level: 'Scale Values', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
  ];
}
