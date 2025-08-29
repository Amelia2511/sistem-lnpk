import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';


@Component({
  selector: 'app-status-penilaian',
  imports: [MatCardModule, MatStepperModule, CardModule, ButtonModule, StepperModule],
  templateUrl: './status-penilaian.component.html',
  styleUrl: './status-penilaian.component.css'
})
export class StatusPenilaianComponent {

}
