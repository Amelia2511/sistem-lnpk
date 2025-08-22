import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPenilaianComponent } from './status-penilaian.component';

describe('StatusPenilaianComponent', () => {
  let component: StatusPenilaianComponent;
  let fixture: ComponentFixture<StatusPenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
