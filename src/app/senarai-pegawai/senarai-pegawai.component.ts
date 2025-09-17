import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Tag } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PegawaiService, Pegawai } from '../services/pegawai.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-senarai-pegawai',
  imports: [TableModule, CommonModule, ButtonModule, TagModule, Tag, MultiSelectModule, InputTextModule, DropdownModule, HttpClientModule],
  templateUrl: './senarai-pegawai.component.html',
  styleUrl: './senarai-pegawai.component.css',
})
export class SenaraiPegawaiComponent implements OnInit{
  statuses!: any[];
  employees: Pegawai[] = [];
  loading: boolean = false;
  
  constructor(private pegawaiService: PegawaiService) {}
  
  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.pegawaiService.getAllPegawai().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        console.log('Loaded employees:', data);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.loading = false;
        // Fallback to dummy data if API fails
        this.employees = this.getDummyData();
      }
    });
  }

  getDummyData(): Pegawai[] {
    // Fallback dummy data in case API is not available
    return [
      {
        id: 1,
        nama: 'Mas Salwa Alie',
        noKp: '920315-14-5678',
        emel: 'mas.salwa@company.gov.my',
        namaJawatan: 'HR Officer',
        skimPerkhidmatan: 'Kontrak',
        gredHakiki: 'S29',
        gredDisandang: 'S29',
        kementerian: 'Kementerian Pembangunan Luar Bandar',
        idBahagian: 'HR001',
        idUnit: 'UN001',
        isActive: true,
        createdAt: '2023-08-12T00:00:00',
        noFail: 'HR2023001'
      }
    ] as Pegawai[];
  }

  // Convert Pegawai data to match your existing table structure
  get products() {
    return this.employees.map(emp => ({
      nama: emp.nama,
      namaJawatan: emp.namaJawatan,
      noKp: emp.noKp,
      emel: emp.emel,
      bahagian: emp.idBahagianNavigation?.namaBahagian || emp.idBahagian,
      unit: emp.idUnitNavigation?.namaUnit || emp.idUnit,
      status: emp.isActive ? 'Aktif' : 'Tidak Aktif',
      buttonOption: emp.isActive ? 'Boleh Dinilai' : 'Aktifkan',
      skimPerkhidmatan: emp.skimPerkhidmatan,
      gred: emp.gredHakiki,
      // Calculate tempoh berkhidmat from createdAt
      tempohBerkhidmat: this.calculateServicePeriod(emp.createdAt),
      // Mock contract dates for now
      tarikhMulaKontrak: new Date(emp.createdAt).toLocaleDateString('ms-MY'),
      tarikhAkhirKontrak: this.calculateEndDate(emp.createdAt)
    }));
  }

  calculateServicePeriod(startDate: string): string {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} tahun ${months > 0 ? months + ' bulan' : ''}`;
    } else {
      return `${months} bulan`;
    }
  }

  calculateEndDate(startDate: string): string {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + 3); // Assuming 3-year contracts
    return end.toLocaleDateString('ms-MY');
  }
}