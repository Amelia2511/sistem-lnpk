import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanSasaranComponent } from './laporan-sasaran.component';

describe('LaporanSasaranComponent', () => {
  let component: LaporanSasaranComponent;
  let fixture: ComponentFixture<LaporanSasaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaporanSasaranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaporanSasaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
