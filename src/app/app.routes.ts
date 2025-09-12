import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LamanUtamaComponent } from './laman-utama/laman-utama.component';
import { DaftarKakitanganBaruComponent } from './daftar-kakitangan-baru/daftar-kakitangan-baru.component';
import { SenaraiPegawaiComponent } from './senarai-pegawai/senarai-pegawai.component';
import { MaklumatPegawaiComponent } from './maklumat-pegawai/maklumat-pegawai.component';
import { SenaraiSasaranComponent } from './senarai-sasaran/senarai-sasaran.component';
import { SasaranComponent } from './sasaran/sasaran.component';
import { TambahAktivitiComponent } from './tambah-aktiviti/tambah-aktiviti.component';
import { DaftarAkaunComponent } from './daftar-akaun/daftar-akaun.component';
import { PegawaiDinilaiComponent } from './pegawai-dinilai/pegawai-dinilai.component';
import { SenaraiPerananComponent } from './senarai-peranan/senarai-peranan.component';

export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai/:id', component: MaklumatPegawaiComponent},
    { path: 'senarai-sasaran', component: SenaraiSasaranComponent},
    { path: 'sasaran', component: SasaranComponent},
    { path: 'tambah-aktiviti', component: TambahAktivitiComponent},
    { path: 'daftar-akaun', component: DaftarAkaunComponent},
    { path: 'pegawai-dinilai', component: PegawaiDinilaiComponent},
    { path: 'senarai-peranan', component: SenaraiPerananComponent}
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
