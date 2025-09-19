import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { userDTO } from '../model/userDTO.model';
import { AuthService } from '../auth/auth.service';
import { PydService } from '../services/pyd.service';
import { pegawai } from '../model/employee.model';

@Component({
  selector: 'app-maklumat-pp',
  imports: [CardModule],
  templateUrl: './maklumat-pp.component.html',
  styleUrl: './maklumat-pp.component.css'
})
export class MaklumatPpComponent {
  user: userDTO = {} as userDTO;
  details: pegawai = {} as pegawai;

  constructor(private authService: AuthService, private pydService: PydService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log(this.user, "Maklumat PP");
      }
      // this.pydService.getMaklumatPenilai(this.user.noKP).subscribe(info => {
      //   this.details = info;
      //   console.log(info)

      // })
    });

  }
}
