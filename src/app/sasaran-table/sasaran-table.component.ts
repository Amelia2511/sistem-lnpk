import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { AktivitiGroup } from '../model/aktiviti-group.model';

type Petunjuk = {
  idPprestasi: number;
  jenisPetunjuk: string;
  keterangan: string;
  sasaranKerja: number | null;
  pencapaianSebenar: number | null;
  ulasan: string | null;
};

@Component({
  selector: 'app-sasaran-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, PaginatorModule],
  templateUrl: './sasaran-table.component.html',
  styleUrl: './sasaran-table.component.css'
})
export class SasaranTableComponent {
  @Input() groups: AktivitiGroup[] = [];
  @Input() pagedGroups: AktivitiGroup[] = [];
  @Input() loading: boolean = false;
  @Input() editable: boolean = false;
  @Input() showPaginator: boolean = true;
  @Input() first: number = 0;
  @Input() pageSize: number = 5;

  @Output() editAktiviti = new EventEmitter<AktivitiGroup>();
  @Output() deleteAktiviti = new EventEmitter<AktivitiGroup>();
  @Output() pageChange = new EventEmitter<{ first: number; rows: number }>();

  onEditAktiviti(group: AktivitiGroup): void {
    this.editAktiviti.emit(group);
  }

  onDeleteAktiviti(group: AktivitiGroup): void {
    this.deleteAktiviti.emit(group);
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.pageChange.emit(event);
  }
}
