import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { RoleStateService } from '../services/role-state.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { userDTO } from '../model/userDTO.model';

@Component({
  selector: 'app-senarai-pegawai-ppp',
  imports: [CommonModule, ButtonModule, CardModule, TableModule, TagModule],
  templateUrl: './senarai-pegawai-ppp.component.html',
  styleUrl: './senarai-pegawai-ppp.component.css'
})
export class SenaraiPegawaiPppComponent implements OnInit {
  user: userDTO = {} as userDTO;
  pegawais: pegawaiDinilai[] = [];

  constructor(
    private pydService: PydService,
    private roleState: RoleStateService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log('👤 Logged in PPP:', this.user);
        this.loadPegawaiList();
      }
    });
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }

    loadPegawaiList(): void {
    if (!this.user.noKP) {
      console.error('❌ No noKP found for user');
      return;
    }

    this.pydService.getPegawaiByPp(this.user.noKP).subscribe({
      next: (data) => {
        console.log('📦 Raw data from backend:', data);

        this.pegawais = data.map(p => ({
          ...p,
          status: p.statusPenilaianTerkini || 'Tiada Penilaian',
        }));

        console.log('✅ Pegawais for PPP:', this.pegawais);
      },
      error: (err) => console.error('❌ Error:', err)
    });
  }

  // getPegawaiList() {
  //   this.pydService.getPegawaiDinilai().subscribe({
  //     next: (data: pegawaiDinilai[]) => {
  //       console.log('Raw data from backend:', data); // Debug: check what you're getting

  //       this.pegawais = data.map(p => ({
  //         ...p,
  //         status: p.statusPenilaianTerkini || 'Tiada Penilaian',
  //       }));

  //       console.log('Mapped pegawais:', this.pegawais); // Debug: check mapped data
  //     },
  //     error: (err) => {
  //       console.error('Error with PydService:', err);
  //     }
  //   });
  // }

  // loadPegawaiList(): void {
  //   this.pydService.getPegawaiByPPP(this.user.noKP).subscribe({
  //     next: (data) => {
  //       this.pegawais = data;
  //       console.log('✅ Pegawais for PPP:', this.pegawais);
  //     },
  //     error: (err) => console.error('❌ Error:', err)
  //   });
  // }
}
