import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-maklumat-pp',
  imports: [MatCardModule, CardModule],
  templateUrl: './maklumat-pp.component.html',
  styleUrl: './maklumat-pp.component.css'
})
export class MaklumatPpComponent {
  pegawaiPenilaiPertama = {
    nama: 'Mas Salwa Alie',
    gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
    noKp: '123456789012',
    jawatan: 'Pegawai Teknologi Maklumat Gred F44',
    bahagian: 'Bahagian Perkhidmatan dan Sokongan',
    unit: 'Unit Teknologi Maklumat'
  };

  pegawaiPenilaiKedua = {
    nama: 'Mimi Safinaz Jamaluddin',
    gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
    noKp: '123456789014',
    jawatan: 'Pegawai Teknologi Maklumat Gred F54',
    bahagian: 'Bahagian Perkhidmatan dan Sokongan',
    unit: 'Unit Teknologi Maklumat'
  };
}
