import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanPegawaiComponent } from './laporan-pegawai.component';

describe('LaporanPegawaiComponent', () => {
  let component: LaporanPegawaiComponent;
  let fixture: ComponentFixture<LaporanPegawaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanPegawaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaporanPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
