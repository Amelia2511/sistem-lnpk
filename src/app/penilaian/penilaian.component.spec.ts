import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenilaianComponent } from './penilaian.component';

describe('PenilaianComponent', () => {
  let component: PenilaianComponent;
  let fixture: ComponentFixture<PenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
