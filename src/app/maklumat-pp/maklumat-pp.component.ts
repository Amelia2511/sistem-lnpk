import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PegawaiService } from '../services/pegawai.service';

import { userDTO } from '../model/userDTO.model';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { pegawai } from '../model/employee.model';
import { pegawaiDinilai } from '../model/pegawai.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maklumat-pp',
  imports: [CardModule, CommonModule],
  standalone: true,
  templateUrl: './maklumat-pp.component.html',
  styleUrl: './maklumat-pp.component.css'
})
export class MaklumatPpComponent {
  idPYD = 1;    // input to recieve from the calling class/component

  // baca pegawaiDinilai drpd database
  // baca pegawaiPenilaiPertama drpd database
  // baca pegawaiPenilaiKedua drpd database

  pegawaiService = inject(PegawaiService);

  pegawaiDinilai = this.pegawaiService.pegawaiDinilai;
  pegawaiPenilaiPertama = this.pegawaiService.pegawaiPenilaiPertama;
  pegawaiPenilaiKedua = this.pegawaiService.pegawaiPenilaiKedua;

  user: userDTO = {} as userDTO;
  details: pegawaiDinilai | null = null;

  constructor(
    private authService: AuthService,
    private pydService: PydService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        this.pydService.getMaklumatPenilai(this.user.noKP).subscribe(info => {
          this.details = info;
        });
      }
    });
  }

  capitalizeWords(value: string | null | undefined): string {
    if (!value) return 'Tiada maklumat';
    return value
      .toLowerCase()
      .split(' ')
      .filter(word => word.trim() !== '')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
