import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaklumatPpComponent } from '../maklumat-pp/maklumat-pp.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SenaraiSoalanComponent } from '../senarai-soalan/senarai-soalan.component';

@Component({
  selector: 'app-penilaian',
  imports: [MaklumatPpComponent, SenaraiSoalanComponent, ButtonModule, CardModule, DialogModule, DividerModule, StepperModule, TableModule, TagModule],
  templateUrl: './penilaian.component.html',
  styleUrl: './penilaian.component.css'
})
export class PenilaianComponent {

}
