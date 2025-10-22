import { Component, OnInit } from '@angular/core';
import { RoleStateService } from '../services/role-state.service';
import { PydService } from '../services/pyd.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router'

@Component({
  selector: 'app-maklumat-pyd',
  imports: [CommonModule, CardModule],
  templateUrl: './maklumat-pyd.component.html',
  styleUrls: ['./maklumat-pyd.component.css']
})
export class MaklumatPydComponent implements OnInit {
  details: any;

  constructor(
    private roleState: RoleStateService,
    private pydService: PydService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roleState.idPyd$.subscribe(id => {
      if (id) {
        this.loadMaklumatPyd(id);
      }
    });
  }

  loadMaklumatPyd(idPyd: number): void {
    this.pydService.getMaklumatPydById(idPyd).subscribe({
      next: (res) => {
        this.details = res;
        console.log('Maklumat PYD:', res);
      },
      error: (err) => {
        console.error('Error fetching maklumat PYD:', err);
      }
    });
  }

  goToSasaranPyd() {
    if (this.details?.idPyd) {
      this.roleState.setIdPyd(this.details.idPyd);
      this.router.navigate(['/sasaran-pyd']);
    }
  }

}