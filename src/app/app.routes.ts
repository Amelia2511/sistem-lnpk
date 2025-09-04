import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LamanUtamaComponent } from './laman-utama/laman-utama.component';
import { DaftarKakitanganBaruComponent } from './daftar-kakitangan-baru/daftar-kakitangan-baru.component';
import { SenaraiSasaranComponent } from './senarai-sasaran/senarai-sasaran.component';
import { SasaranComponent } from './sasaran/sasaran.component';
import { TambahAktivitiComponent } from './tambah-aktiviti/tambah-aktiviti.component';
import { SenaraiPegawaiComponent } from './senarai-pegawai/senarai-pegawai.component';
import { MaklumatPegawaiComponent } from './maklumat-pegawai/maklumat-pegawai.component';
import { LaporanSasaranComponent } from './laporan-sasaran/laporan-sasaran.component';
import { SenaraiPenilaianComponent } from './senarai-penilaian/senarai-penilaian.component';
import { PenilaianComponent } from './penilaian/penilaian.component';

export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent},
    { path: 'senarai-sasaran', component: SenaraiSasaranComponent},
    { path: 'sasaran', component: SasaranComponent},
    { path: 'tambah-aktiviti', component: TambahAktivitiComponent},
    { path: 'maklumat-sasaran', component: LaporanSasaranComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai', component: MaklumatPegawaiComponent},
    { path: 'senarai-penilaian', component: SenaraiPenilaianComponent},
    { path: 'penilaian', component: PenilaianComponent},
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
