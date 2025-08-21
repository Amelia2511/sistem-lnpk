import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaisarahComponent } from './maisarah.component';

describe('MaisarahComponent', () => {
  let component: MaisarahComponent;
  let fixture: ComponentFixture<MaisarahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaisarahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaisarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
