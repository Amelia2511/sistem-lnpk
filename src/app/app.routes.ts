import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { LamanUtamaComponent } from './laman-utama/laman-utama.component';
import { DaftarKakitanganBaruComponent } from './daftar-kakitangan-baru/daftar-kakitangan-baru.component';

export const routes: Routes = [
    { path: 'log-masuk', component: LoginPageComponent },
    { path: 'laman-utama', component: LamanUtamaComponent },
    { path: 'daftar-anggota', component: DaftarKakitanganBaruComponent}
    // { path: '', redirectTo: '/laman-utama', pathMatch: 'full' }
];
