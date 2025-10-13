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
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { pegawaiDinilai } from '../model/pegawai.model';
import { MaklumatPydComponent } from '../maklumat-pyd/maklumat-pyd.component';
import { PenilaianService } from '../services/penilaian.service';
import { AuthService } from '../auth/auth.service';
import { SenaraiSoalanComponent } from '../senarai-soalan/senarai-soalan.component';

@Component({
  selector: 'app-penilaian',
  imports: [SenaraiSoalanComponent, MaklumatPydComponent, FormsModule, CommonModule, InputNumber, ButtonModule, CardModule, DialogModule, DividerModule, StepperModule, TableModule, TagModule],
  templateUrl: './penilaian.component.html',
  styleUrl: './penilaian.component.css'
})
export class PenilaianComponent {
  marks: number[] = Array(22).fill(0);

  markahKeseluruhan1: number = 0;
  markahKeseluruhan2: number = 0;

  constructor(private penilaian: PenilaianService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.noKP) {
        this.penilaian.getLatestPenilaianByNoKp(user.noKP).subscribe();

        this.penilaian.getMarkah(user.noKP).subscribe(data => {
          this.marks = data; 
          this.calculateMarkahKeseluruhan();
        });
      }
    });
  }

  onInputChange(): void {
    this.calculateMarkahKeseluruhan();
  }

  calculateMarkahKeseluruhan(): void {
    const ganjil = this.marks.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);
    const genap = this.marks.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0);

    this.markahKeseluruhan1 = (ganjil / (11 * 10)) * 100;
    this.markahKeseluruhan2 = (genap / (11 * 10)) * 100;
  }
}
