import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarKakitanganBaruComponent } from './daftar-kakitangan-baru.component';

describe('DaftarKakitanganBaruComponent', () => {
  let component: DaftarKakitanganBaruComponent;
  let fixture: ComponentFixture<DaftarKakitanganBaruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaftarKakitanganBaruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaftarKakitanganBaruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
