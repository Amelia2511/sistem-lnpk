import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from "primeng/table";
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-maklumat-pegawai',
  standalone: true,
  imports: [CardModule, TableModule, ImageModule, ButtonModule, BreadcrumbModule, CommonModule, InputTextModule, EditorModule],
  templateUrl: './maklumat-pegawai.component.html',
  styleUrl: './maklumat-pegawai.component.css'
})
export class MaklumatPegawaiComponent implements OnInit{
  pegawai: any;

  allPegawai = [
    {
      id: 1,
      nama: 'Mas Salwa Alie',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '880101-14-0001' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F44' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '12 Ogos 2023' },
        { label: 'Tarikh Akhir Kontrak', label2: '12 Ogos 2026' }
      ]
    },
    {
      id: 2,
      nama: 'Noor Amelia Mohd Noor',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '900505-14-0002' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F41' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '16 Oktober 2022' },
        { label: 'Tarikh Akhir Kontrak', label2: '16 Oktober 2027' }
      ]
    },
    {
      id: 3,
      nama: 'Nur Syahmina Mohd Noorhisham',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '920303-14-0003' },
        { label: 'Skim Perkhidmatan', label2: 'Penolong Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'FA29' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Penolong Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '20 Oktober 2022' },
        { label: 'Tarikh Akhir Kontrak', label2: '20 Oktober 2026' }
      ]
    },
    {
      id: 4,
      nama: 'Mohamad Azim Hasnul Azlan',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '950707-14-0004' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F41' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '9 Julai 2024' },
        { label: 'Tarikh Akhir Kontrak', label2: '9 Julai 2026' }
      ]
    },
    {
      id: 5,
      nama: 'Rabia’tul Adawiyah Khairul Azwan',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '970505-14-0005' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F41' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '12 Ogos 2024' },
        { label: 'Tarikh Akhir Kontrak', label2: '12 Ogos 2026' }
      ]
    },
    {
      id: 6,
      nama: 'Nur Izzatul Iffah Mazlan',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '981111-14-0006' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F41' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '18 November 2022' },
        { label: 'Tarikh Akhir Kontrak', label2: '18 November 2026' }
      ]
    },
    {
      id: 7,
      nama: 'Faris Rassoulli Rizal Wong',
      gambar: 'image/placeholder.jpg',
      details: [
        { label: 'No Kad Pengenalan', label2: '990505-14-0007' },
        { label: 'Skim Perkhidmatan', label2: 'Pegawai IT' },
        { label: 'Gred Hakiki', label2: 'F54' },
        { label: 'Tempat Bertugas', label2: 'Unit Teknologi Maklumat' },
        { label: 'Jawatan', label2: 'Pegawai IT' },
        { label: 'Tarikh Mula Kontrak', label2: '12 Mei 2021' },
        { label: 'Tarikh Akhir Kontrak', label2: '12 Mei 2026' }
      ]
    }
  ];

  items: MenuItem[] = [{ label: 'Senarai', routerLink: '/senarai-pegawai'},{ label: 'Form', routerLink: '/daftar-anggota' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  isEditMode = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pegawai = this.allPegawai.find(p => p.id === id);
  }
}
