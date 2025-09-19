import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { CalendarModule } from 'primeng/calendar';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-daftar-kakitangan-baru',
  imports: [FormsModule, MatDatepickerModule, MatIconModule, MatInputModule, DatePickerModule, FluidModule, CalendarModule, BreadcrumbModule],
  templateUrl: './daftar-kakitangan-baru.component.html',
  styleUrl: './daftar-kakitangan-baru.component.css'
})
export class DaftarKakitanganBaruComponent {
formData: any;
toggleinput: unknown;
date1: any;
date2: any;
items = ["tada", "chacha", "yuyu"]

}

export class DatePickerIconDemo {
    date1: Date | undefined;

    date2: Date | undefined;
}