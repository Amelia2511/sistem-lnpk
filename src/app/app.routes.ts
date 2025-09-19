import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LamanUtamaComponent } from './laman-utama/laman-utama.component';
import { DaftarKakitanganBaruComponent } from './daftar-kakitangan-baru/daftar-kakitangan-baru.component';
import { SenaraiSasaranComponent } from './senarai-sasaran/senarai-sasaran.component';
import { SasaranComponent } from './sasaran/sasaran.component';
import { TambahAktivitiComponent } from './tambah-aktiviti/tambah-aktiviti.component';
import { SenaraiPegawaiComponent } from './senarai-pegawai/senarai-pegawai.component';
import { MaklumatPegawaiComponent } from './maklumat-pegawai/maklumat-pegawai.component';

export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent},
    { path: 'senarai-sasaran', component: SenaraiSasaranComponent},
    { path: 'sasaran', component: SasaranComponent},
    { path: 'tambah-aktiviti', component: TambahAktivitiComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai', component: MaklumatPegawaiComponent}
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
