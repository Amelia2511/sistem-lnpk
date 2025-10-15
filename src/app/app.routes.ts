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
import { DaftarAkaunComponent } from './daftar-akaun/daftar-akaun.component';
import { PegawaiDinilaiComponent } from './pegawai-dinilai/pegawai-dinilai.component';
import { SenaraiPerananComponent } from './senarai-peranan/senarai-peranan.component';
import { PenilaianComponent } from './penilaian/penilaian.component';
import { PenilaianPrestasiComponent } from './penilaian-prestasi/penilaian-prestasi.component';
import { SenaraiPenilaianComponent } from './senarai-penilaian/senarai-penilaian.component';
import { SenaraiSoalanComponent } from './senarai-soalan/senarai-soalan.component';
import { PenilaianPpkComponent } from './penilaian-ppk/penilaian-ppk.component';
import { sktMetaResolver } from './resolvers/skt-meta.resolver';
import { SenaraiPydPpComponent } from './senarai-pyd-pp/senarai-pyd-pp.component';
import { MaklumatPydComponent } from './maklumat-pyd/maklumat-pyd.component';
import { SasaranPpComponent } from './sasaran-pp/sasaran-pp.component';
import { EditAktivitiComponent } from './edit-aktiviti/edit-aktiviti.component';
import { SenaraiSasaranPppComponent } from './senarai-sasaran-ppp/senarai-sasaran-ppp.component';
export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent},
    { path: 'senarai-sasaran', component: SenaraiSasaranComponent},
    { path: 'sasaran', component: SasaranComponent, resolve: { skt: sktMetaResolver },
    // ensure resolver re-runs when query params change (idSkt changes)
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'},
    { path: 'aktiviti/edit/:id', component: EditAktivitiComponent },
    { path: 'tambah-aktiviti', component: TambahAktivitiComponent},
    { path: 'maklumat-sasaran', component: LaporanSasaranComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai', component: MaklumatPegawaiComponent},
    { path: 'senarai-penilaian', component: SenaraiPenilaianComponent},
    { path: 'penilaian', component: PenilaianComponent},
    { path: 'senarai-pegawai', component: SenaraiPegawaiComponent},
    { path: 'maklumat-pegawai/:id', component: MaklumatPegawaiComponent},
    { path: 'daftar-akaun', component: DaftarAkaunComponent},
    { path: 'pegawai-dinilai', component: PegawaiDinilaiComponent},
    { path: 'senarai-peranan', component: SenaraiPerananComponent},
    { path: 'penilaian-prestasi', component: PenilaianPrestasiComponent},
    { path: 'senarai-penilaian', component: SenaraiPenilaianComponent},
    { path: 'senarai-soalan', component: SenaraiSoalanComponent},
    { path: 'penilaian', component: PenilaianComponent},
    { path: 'penilaian-ppk', component: PenilaianPpkComponent},
    { path: 'maklumat-pyd', component: MaklumatPydComponent},
    { path: 'senarai-pyd-pp', component: SenaraiPydPpComponent},
    { path: 'sasaran-pp', component: SasaranPpComponent},
    { path: 'senarai-sasaran-ppp', component: SenaraiSasaranPppComponent}
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
