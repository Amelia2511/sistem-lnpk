import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PegawaiDinilaiComponent } from './pegawai-dinilai.component';

describe('PegawaiDinilaiComponent', () => {
  let component: PegawaiDinilaiComponent;
  let fixture: ComponentFixture<PegawaiDinilaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PegawaiDinilaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PegawaiDinilaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
