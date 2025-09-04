import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SasaranComponent } from './sasaran.component';

describe('SasaranComponent', () => {
  let component: SasaranComponent;
  let fixture: ComponentFixture<SasaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SasaranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SasaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
