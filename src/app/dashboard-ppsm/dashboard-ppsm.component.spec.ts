import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPpsmComponent } from './dashboard-ppsm.component';

describe('DashboardPpsmComponent', () => {
  let component: DashboardPpsmComponent;
  let fixture: ComponentFixture<DashboardPpsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPpsmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPpsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
