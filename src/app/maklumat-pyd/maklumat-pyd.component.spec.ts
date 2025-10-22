import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaklumatPydComponent } from './maklumat-pyd.component';

describe('MaklumatPydComponent', () => {
  let component: MaklumatPydComponent;
  let fixture: ComponentFixture<MaklumatPydComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaklumatPydComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaklumatPydComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
