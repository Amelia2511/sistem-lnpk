import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LamanUtamaComponent } from './laman-utama.component';

describe('LamanUtamaComponent', () => {
  let component: LamanUtamaComponent;
  let fixture: ComponentFixture<LamanUtamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LamanUtamaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LamanUtamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
