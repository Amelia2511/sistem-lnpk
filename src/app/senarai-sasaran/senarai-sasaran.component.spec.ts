import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiSasaranComponent } from './senarai-sasaran.component';

describe('SenaraiSasaranComponent', () => {
  let component: SenaraiSasaranComponent;
  let fixture: ComponentFixture<SenaraiSasaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiSasaranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiSasaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
