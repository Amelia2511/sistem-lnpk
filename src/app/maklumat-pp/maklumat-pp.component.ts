import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PegawaiService } from '../services/pegawai.service';


@Component({
  selector: 'app-maklumat-pp',
  imports: [CardModule],
  standalone: true,
  templateUrl: './maklumat-pp.component.html',
  styleUrl: './maklumat-pp.component.css'
})
export class MaklumatPpComponent {
  idPYD = 1;    // input to recieve from the calling class/component

  // baca pegawaiDinilai drpd database
  // baca pegawaiPenilaiPertama drpd database
  // baca pegawaiPenilaiKedua drpd database

  pegawaiService = inject(PegawaiService);

  pegawaiDinilai = this.pegawaiService.pegawaiDinilai;
  pegawaiPenilaiPertama = this.pegawaiService.pegawaiPenilaiPertama;
  pegawaiPenilaiKedua = this.pegawaiService.pegawaiPenilaiKedua;
  // pegawaiDinilai = {
  //   nama: 'Yaya',
  //   gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
  //   noKp: '123456789012',
  //   jawatan: 'Pegawai Teknologi Maklumat Gred',
  //   bahagian: 'Bahagian Perkhidmatan dan Sokongan',
  //   gred: 'F14',
  //   unit: 'Unit Teknologi Maklumat',
  //   idPPP: 1,
  //   idPPK: 2,
  // };

  // pegawaiPenilaiPertama = {
  //   nama: 'Saraliza',
  //   gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
  //   noKp: '123456789012',
  //   jawatan: 'Pegawai Teknologi Maklumat Gred',
  //   bahagian: 'Bahagian Perkhidmatan dan Sokongan',
  //   gred: 'F84',
  //   unit: 'Unit Teknologi Maklumat'
  // };

  // pegawaiPenilaiKedua = {
  //   nama: 'Mimi Safinaz Jamaluddin',
  //   gambar: 'https://imgs.search.brave.com/8kCKM_jpOXqInK09U--KJjMEaXU_RuaR-XpcUmivzWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/Mzc1L3RodW1iLTM1/MC0zNzU5MTEud2Vi/cA',
  //   noKp: '123456789014',
  //   jawatan: 'Pegawai Teknologi Maklumat Gred',
  //   bahagian: 'Bahagian Perkhidmatan dan Sokongan',
  //   gred: 'F54',
  //   unit: 'Unit Teknologi Maklumat'
  // };
}
