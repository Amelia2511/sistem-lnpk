import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahAktivitiComponent } from './tambah-aktiviti.component';

describe('TambahAktivitiComponent', () => {
  let component: TambahAktivitiComponent;
  let fixture: ComponentFixture<TambahAktivitiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TambahAktivitiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TambahAktivitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
