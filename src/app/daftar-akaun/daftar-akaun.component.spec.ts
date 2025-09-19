import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarAkaunComponent } from './daftar-akaun.component';

describe('DaftarAkaunComponent', () => {
  let component: DaftarAkaunComponent;
  let fixture: ComponentFixture<DaftarAkaunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaftarAkaunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaftarAkaunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
