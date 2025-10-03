import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { userDTO } from '../model/userDTO.model';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { pegawaiDinilai } from '../model/pegawai.model';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-maklumat-pyd',
  imports: [CardModule, CommonModule],
  templateUrl: './maklumat-pyd.component.html',
  styleUrl: './maklumat-pyd.component.css'
})
export class MaklumatPydComponent {
  user: userDTO = {} as userDTO;
  details!: pegawaiDinilai;

  constructor(
    private authService: AuthService,
    private pydService: PydService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;

        this.pydService.getMaklumatPyd(this.user.noKP).subscribe(res => {
          console.log("Maklumat Pyd API Response:", res);

          this.details = Array.isArray(res) ? res[0] : res;

          console.log("Details set:", this.details);
        });

      }
    });
  }

  // capitalizeWords(value: string | null | undefined): string {
  //   if (!value) return 'Tiada maklumat';
  //   return value
  //     .toLowerCase()
  //     .split(' ')
  //     .filter(word => word.trim() !== '')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // }
}
