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
import { PenilaianPrestasiComponent } from './penilaian-prestasi/penilaian-prestasi.component';
import { SenaraiPenilaianComponent } from './senarai-penilaian/senarai-penilaian.component';
import { SenaraiSoalanComponent } from './senarai-soalan/senarai-soalan.component';
import { PenilaianComponent } from './penilaian/penilaian.component';

export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent},
    { path: 'senarai-sasaran', component: SenaraiSasaranComponent},
    { path: 'sasaran', component: SasaranComponent},
    { path: 'tambah-aktiviti', component: TambahAktivitiComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai/:id', component: MaklumatPegawaiComponent},
    { path: 'daftar-akaun', component: DaftarAkaunComponent},
    { path: 'pegawai-dinilai', component: PegawaiDinilaiComponent},
    { path: 'senarai-peranan', component: SenaraiPerananComponent},
    { path: 'penilaian-prestasi', component: PenilaianPrestasiComponent},
    { path: 'senarai-penilaian', component: SenaraiPenilaianComponent},
    { path: 'senarai-soalan', component: SenaraiSoalanComponent},
    { path: 'penilaian', component: PenilaianComponent}
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
