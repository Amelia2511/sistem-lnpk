import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YayaComponent } from './yaya.component';

describe('YayaComponent', () => {
  let component: YayaComponent;
  let fixture: ComponentFixture<YayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YayaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
