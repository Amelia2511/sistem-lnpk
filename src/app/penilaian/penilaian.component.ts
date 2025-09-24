import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-penilaian',
  imports: [ButtonModule, CardModule, DialogModule, DividerModule, StepperModule, TableModule, TagModule, CommonModule, InputNumberModule],
  templateUrl: './penilaian.component.html',
  styleUrl: './penilaian.component.css'
})
export class PenilaianComponent {

}
