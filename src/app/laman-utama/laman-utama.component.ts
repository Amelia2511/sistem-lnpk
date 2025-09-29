import { Component } from '@angular/core';
import { StatusPenilaianComponent } from '../status-penilaian/status-penilaian.component';
import { MaklumatPpComponent } from '../maklumat-pp/maklumat-pp.component';
import { DashboardPpsmComponent } from '../dashboard-ppsm/dashboard-ppsm.component'; 
import { userDTO } from '../model/userDTO.model';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { pegawai } from '../model/employee.model';
import { pegawaiDinilai } from '../model/pegawai.model';
import { RoleStateService } from '../services/role-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-laman-utama',
  imports: [StatusPenilaianComponent, MaklumatPpComponent, CommonModule, DashboardPpsmComponent],
  templateUrl: './laman-utama.component.html',
  styleUrl: './laman-utama.component.css'
})
export class LamanUtamaComponent {
  user: userDTO = {} as userDTO;
  details: pegawaiDinilai = {} as pegawaiDinilai;

  constructor(private authService: AuthService, private pydService: PydService, private roleState: RoleStateService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
      
      this.pydService.getMaklumatPenilai(this.user.noKP).subscribe(info => {
        this.details = info;
      })
    }
    });
  }

  hasRole(role: number): boolean {
    return this.roleState.hasRole(role);
  }

  hasAnyRole(roles: number[]): boolean {
    return this.roleState.hasAnyRole(roles);
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
