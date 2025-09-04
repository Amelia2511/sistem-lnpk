import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-laporan-pegawai',
  imports: [TableModule, CommonModule, ButtonModule, TagModule, Tag, MultiSelectModule, InputTextModule, DropdownModule],
  templateUrl: './laporan-pegawai.component.html',
  styleUrl: './laporan-pegawai.component.css'
})
export class LaporanPegawaiComponent {
statuses!: any[];
  ngOnInit() {
  }
  products = [
    {
      nama: 'Mas Salwa Alie',
      tarikhMulaKontrak: '12 Ogos 2023',
      tarikhAkhirKontrak: '12 Ogos 2026',
      tempohBerkhidmat: '2 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
    {
      nama: 'Noor Amelia Mohd Noor',
      tarikhMulaKontrak: '16 Oktober 2022',
      tarikhAkhirKontrak: '16 Oktober 2027',
      tempohBerkhidmat: '3 tahun',
      status: 'Tidak Aktif',
      buttonOption: 'Aktifkan'
    },
    {
      nama: 'Nur Syahmina Mohd Noorhisham',
      tarikhMulaKontrak: '20 Oktober 2022',
      tarikhAkhirKontrak: '20 Oktober 2026',
      tempohBerkhidmat: '3 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
    {
      nama: 'Mohamad Azim Hasnul Azlan',
      tarikhMulaKontrak: '9 Julai 2024',
      tarikhAkhirKontrak: '9 Julai 2026',
      tempohBerkhidmat: '1 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
    {
      nama: 'Rabia’tul Adawiyah Khairul Azwan',
      tarikhMulaKontrak: '12 Ogos 2024',
      tarikhAkhirKontrak: '12 Ogos 2026',
      tempohBerkhidmat: '1 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
    {
      nama: ' Nur Izzatul Iffah Mazlan',
      tarikhMulaKontrak: '18 November 2022',
      tarikhAkhirKontrak: '18 November 2026',
      tempohBerkhidmat: '3 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
    {
      nama: 'Faris Rassoulli Rizal Wong',
      tarikhMulaKontrak: '12 Mei 2021',
      tarikhAkhirKontrak: '12 Mei 2026',
      tempohBerkhidmat: '4 tahun',
      status: 'Aktif',
      buttonOption: 'Lihat Laporan'
    },
  ];

  handleButtonClick(product: any) {
  if (product.buttonOption === 'Aktifkan') {
    product.buttonOption = 'Lihat Laporan';
    product.status = 'Aktif';
    console.log(product.nama + ' telah diaktifkan');
  } 
}

}
