import { Component } from '@angular/core';
import { userDTO } from '../model/userDTO.model';
import { SasaranKerjaService } from '../services/sasaran-kerja.service';
import { AuthService } from '../auth/auth.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-status-penilaian',
  imports: [CardModule, ButtonModule, StepperModule, TagModule],
  templateUrl: './status-penilaian.component.html',
  styleUrl: './status-penilaian.component.css'
})
export class StatusPenilaianComponent {
  user: userDTO = {} as userDTO;
  activeStep: number = 1;
  tahunPenilaian: number | null = null;
  kategoriPenilaian: string | null = null;

  constructor(
    private sasaranKerjaService: SasaranKerjaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(res => {
      if (res) {
        this.user = res;
        console.log('👤 Logged in user:', this.user);
        this.loadStatusPenilaian();
      }
    });
  }

  // loadStatusPenilaian(): void {    if (!this.user.noKP) {
  //     console.error('❌ No noKP found for user');
  //     return;
  //   }

  //   console.log('🔍 Fetching status for noKP:', this.user.noKP);

  //   this.sasaranKerjaService.getStatusPenilaianTerkini(this.user.noKP).subscribe({
  //     next: (response) => {
  //       console.log('✅ Full response:', response);
  //       console.log('📊 Status value:', response.statusPenilaian);

  //       this.activeStep = response.statusPenilaian;

  //       console.log('🎯 Active step set to:', this.activeStep);
  //     },
  //     error: (err) => {
  //       console.error('❌ Error loading status:', err);

  //       if (err.status === 404) {
  //         console.log('No SKT found - defaulting to status 1');
  //         this.activeStep = 1;
  //       }
  //     }
  //   });
  loadStatusPenilaian(): void {
    if (!this.user.noKP) {
      console.error('❌ No noKP found for user');
      return;
    }

    console.log('🔍 Fetching status for noKP:', this.user.noKP);

    this.sasaranKerjaService.getStatusPenilaianTerkini(this.user.noKP).subscribe({
      next: (response) => {
        console.log('✅ Full response:', response);

        // Extract the nested statusPenilaian object
        const statusData = response.statusPenilaian;

        console.log('📊 Status data:', statusData);
        console.log('📊 Status value:', statusData.statusPenilaian);
        console.log('📅 Tahun:', statusData.tahunPenilaian);
        console.log('📋 Kategori:', statusData.kategoriPenilaian);

        // Set the active step
        this.activeStep = statusData.statusPenilaian;
        this.tahunPenilaian = statusData.tahunPenilaian;
        this.kategoriPenilaian = statusData.kategoriPenilaian;

        console.log('🎯 Active step set to:', this.activeStep);
      },
      error: (err) => {
        console.error('❌ Error loading status:', err);

        if (err.status === 404) {
          console.log('No SKT found - defaulting to status 1');
          this.activeStep = 1;
          this.tahunPenilaian = null;
          this.kategoriPenilaian = null;
        }
      }
    });
  }
}
