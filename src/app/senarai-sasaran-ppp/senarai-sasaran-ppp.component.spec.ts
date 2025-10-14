import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiSasaranPppComponent } from './senarai-sasaran-ppp.component';

describe('SenaraiSasaranPppComponent', () => {
  let component: SenaraiSasaranPppComponent;
  let fixture: ComponentFixture<SenaraiSasaranPppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiSasaranPppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiSasaranPppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
