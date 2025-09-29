import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPpComponent } from './dashboard-pp.component';

describe('DashboardPpComponent', () => {
  let component: DashboardPpComponent;
  let fixture: ComponentFixture<DashboardPpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
