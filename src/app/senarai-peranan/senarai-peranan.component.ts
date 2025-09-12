import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { pegawai } from '../model/employee.model';
import { ButtonModule } from 'primeng/button';
import { HttpErrorResponse } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SelectModule } from 'primeng/select';
import { peranan } from '../model/peranan.model';

@Component({
  selector: 'app-senarai-peranan',
  imports: [ButtonModule, RouterModule, DropdownModule, CommonModule, FormsModule, SelectModule],
  templateUrl: './senarai-peranan.component.html',
  styleUrl: './senarai-peranan.component.css'
})

export class SenaraiPerananComponent implements OnInit {
  pegawaiList: pegawai[] = [];
  selectedPegawai: pegawai | null = null;
  perananList: peranan[] = [];
  selectedPeranan: peranan | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getSenaraiPegawai();
    this.getSenaraiPeranan();
  }

  getSenaraiPegawai() {
    this.employeeService.get().subscribe({
      next: (data: pegawai[]) => {
        console.log('Pegawai diterima dari API:', data);
        this.pegawaiList = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load data:', err.message);
      }
    });
  }

  getSenaraiPeranan() {
    this.employeeService.getPeranan().subscribe({
      next: (data: peranan[]) => {
        console.log('Peranan diterima dari API:', data);
        this.perananList = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load peranan data:', err.message);
      }
    });
  }

}