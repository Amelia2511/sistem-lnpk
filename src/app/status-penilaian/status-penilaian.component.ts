import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';


@Component({
  selector: 'app-status-penilaian',
  imports: [CardModule, ButtonModule, StepperModule],
  templateUrl: './status-penilaian.component.html',
  styleUrl: './status-penilaian.component.css'
})
export class StatusPenilaianComponent {

}
