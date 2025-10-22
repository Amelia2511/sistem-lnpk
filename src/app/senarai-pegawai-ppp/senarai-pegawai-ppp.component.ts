import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PydService } from '../services/pyd.service';
import { RoleStateService } from '../services/role-state.service';
import { pegawaiDinilai } from '../model/pegawai.model';

@Component({
  selector: 'app-senarai-pegawai-ppp',
  imports: [CommonModule, ButtonModule, CardModule, TableModule, TagModule],
  templateUrl: './senarai-pegawai-ppp.component.html',
  styleUrl: './senarai-pegawai-ppp.component.css'
})
export class SenaraiPegawaiPppComponent implements OnInit {
  pegawais: pegawaiDinilai[] = [];

  constructor(
    private pydService: PydService, private roleState: RoleStateService
  ) { }

  ngOnInit() {
    this.getPegawaiList();
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }

  getPegawaiList() {
    this.pydService.getPegawaiDinilai().subscribe({
      next: (data: pegawaiDinilai[]) => {
        console.log('Raw data from backend:', data); // Debug: check what you're getting

        this.pegawais = data.map(p => ({
          ...p,
          status: p.statusPenilaianTerkini || 'Tiada Penilaian',
        }));

        console.log('Mapped pegawais:', this.pegawais); // Debug: check mapped data
      },
      error: (err) => {
        console.error('Error with PydService:', err);
      }
    });
  }

}
