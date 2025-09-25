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
import { pegawaiDinilai } from '../model/pegawai.model';
import { PydService } from '../services/pyd.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maklumat-pegawai',
  standalone: true,
  imports: [CardModule, TableModule, ImageModule, ButtonModule, BreadcrumbModule, CommonModule, InputTextModule, EditorModule, FormsModule],
  templateUrl: './maklumat-pegawai.component.html',
  styleUrl: './maklumat-pegawai.component.css'
})

export class MaklumatPegawaiComponent implements OnInit {
  pegawai!: pegawaiDinilai;
  isEditMode = false;

  items: MenuItem[] = [
    { label: 'Senarai', routerLink: '/senarai-pegawai' },
    { label: 'Tambah Pegawai', routerLink: '/daftar-anggota' }
  ];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  pegawaiId!: number;
  
  constructor(
    private route: ActivatedRoute,
    private pydService: PydService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.pydService.updatePegawai(this.pegawai.id!, this.pegawai).subscribe({
        next: (data) => {
          this.pegawai = data;
        },
        error: (err) => {
          console.error('Gagal ambil data pegawai:', err);
        }
      });
    }
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      this.pydService.updatePegawai(this.pegawai.id!, this.pegawai).subscribe({
        next: (data: pegawaiDinilai) => {
          this.pegawai = data;
        },
        error: (err: any) => {
          console.error('Gagal ambil data pegawai:', err);
        }
      });
      this.pydService.updatePegawai(this.pegawai.id!, this.pegawai).subscribe({
        next: () => console.log('Maklumat pegawai berjaya disimpan.'),
        error: (err: any) => console.error('Gagal simpan data:', err)
      });
    }
  }
}