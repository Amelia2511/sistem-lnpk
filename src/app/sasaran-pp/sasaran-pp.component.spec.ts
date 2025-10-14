import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SasaranPpComponent } from './sasaran-pp.component';

describe('SasaranPpComponent', () => {
  let component: SasaranPpComponent;
  let fixture: ComponentFixture<SasaranPpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SasaranPpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SasaranPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
