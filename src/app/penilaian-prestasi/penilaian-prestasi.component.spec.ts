import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenilaianPrestasiComponent } from './penilaian-prestasi.component';

describe('PenilaianPrestasiComponent', () => {
  let component: PenilaianPrestasiComponent;
  let fixture: ComponentFixture<PenilaianPrestasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenilaianPrestasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenilaianPrestasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
