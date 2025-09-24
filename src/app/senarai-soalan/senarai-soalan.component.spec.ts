import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiSoalanComponent } from './senarai-soalan.component';

describe('SenaraiSoalanComponent', () => {
  let component: SenaraiSoalanComponent;
  let fixture: ComponentFixture<SenaraiSoalanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiSoalanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiSoalanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
