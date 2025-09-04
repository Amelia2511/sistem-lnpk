import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DatePicker } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daftar-kakitangan-baru',
  imports: [FormsModule, MatDatepickerModule, MatIconModule, MatInputModule, DatePickerModule, FluidModule, CalendarModule, BreadcrumbModule, DatePicker, ButtonModule, RouterModule],
  templateUrl: './daftar-kakitangan-baru.component.html',
  styleUrl: './daftar-kakitangan-baru.component.css'
})
export class DaftarKakitanganBaruComponent {
formData: any;
toggleinput: unknown;
date1: any;
date2: any;

items: MenuItem[] = [{ label: 'Senarai', routerLink: '/senarai-pegawai'}, { label: 'Form', routerLink: '/daftar-anggota' }];
home: MenuItem = { icon: 'pi pi-home', routerLink: '/' }; 

constructor(private router: Router) {}

simpan() {
  console.log('Data pegawai baru:', this.formData, this.date1, this.date2);

  this.router.navigate(['/senarai-pegawai']);
}

}

export class DatePickerIconDemo {
    date1: Date | undefined;

    date2: Date | undefined;
}