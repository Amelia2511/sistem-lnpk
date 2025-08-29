import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sasaran',
  imports: [ButtonModule, TableModule, TagModule],
  templateUrl: './sasaran.component.html',
  styleUrl: './sasaran.component.css'
})
export class SasaranComponent {
  private router = inject(Router);

  onButtonClick() {
    this.router.navigate(['/tambah-aktiviti']);
  }
}
