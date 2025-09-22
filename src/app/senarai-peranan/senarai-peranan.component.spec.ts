import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPerananComponent } from './senarai-peranan.component';

describe('SenaraiPerananComponent', () => {
  let component: SenaraiPerananComponent;
  let fixture: ComponentFixture<SenaraiPerananComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPerananComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPerananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
