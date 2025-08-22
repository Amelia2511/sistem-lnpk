import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaklumatPpComponent } from './maklumat-pp.component';

describe('MaklumatPpComponent', () => {
  let component: MaklumatPpComponent;
  let fixture: ComponentFixture<MaklumatPpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaklumatPpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaklumatPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
