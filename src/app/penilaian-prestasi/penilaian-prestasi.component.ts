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
import { RoleStateService } from '../services/role-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penilaian-prestasi',
  imports: [MaklumatPpComponent, SenaraiSoalanComponent, ButtonModule, CardModule, DialogModule, DividerModule, StepperModule, TableModule, TagModule, CommonModule],
  templateUrl: './penilaian-prestasi.component.html',
  styleUrl: './penilaian-prestasi.component.css'
})
export class PenilaianPrestasiComponent {

  private roleState = inject(RoleStateService);
  roles$ = this.roleState.roles$;
  roles: number[] = [];

  ngOnInit(): void {
    this.roles$.subscribe(r => {
      this.roles = r;
      console.log("roles from service:", r);
    });
  }

  shouldShow(roles: number[]): boolean {
    const has3or4 = roles.includes(3) || roles.includes(4);
    const has5Only = roles.length === 1 && roles[0] === 5;
    const isAdmin = roles.includes(7); // admin override

    return isAdmin || has3or4 || !has5Only;
  }
}


