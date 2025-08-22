import { Component } from '@angular/core';
import { StatusPenilaianComponent } from '../status-penilaian/status-penilaian.component';
import { MaklumatPpComponent } from '../maklumat-pp/maklumat-pp.component';

@Component({
  selector: 'app-laman-utama',
  imports: [StatusPenilaianComponent, MaklumatPpComponent],
  templateUrl: './laman-utama.component.html',
  styleUrl: './laman-utama.component.css'
})
export class LamanUtamaComponent {
  name = 'Ee Zhe';
}
