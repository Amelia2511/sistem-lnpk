import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahPetunjukPrestasiComponent } from './tambah-petunjuk-prestasi.component';

describe('TambahPetunjukPrestasiComponent', () => {
  let component: TambahPetunjukPrestasiComponent;
  let fixture: ComponentFixture<TambahPetunjukPrestasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TambahPetunjukPrestasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TambahPetunjukPrestasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
