import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SasaranTableComponent } from './sasaran-table.component';

describe('SasaranTableComponent', () => {
  let component: SasaranTableComponent;
  let fixture: ComponentFixture<SasaranTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SasaranTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SasaranTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
