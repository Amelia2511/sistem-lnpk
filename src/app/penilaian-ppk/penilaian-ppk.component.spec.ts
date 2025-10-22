import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenilaianPpkComponent } from './penilaian-ppk.component';

describe('PenilaianPpkComponent', () => {
  let component: PenilaianPpkComponent;
  let fixture: ComponentFixture<PenilaianPpkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenilaianPpkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenilaianPpkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
