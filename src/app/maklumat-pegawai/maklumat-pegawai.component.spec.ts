import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaklumatPegawaiComponent } from './maklumat-pegawai.component';

describe('MaklumatPegawaiComponent', () => {
  let component: MaklumatPegawaiComponent;
  let fixture: ComponentFixture<MaklumatPegawaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaklumatPegawaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaklumatPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
