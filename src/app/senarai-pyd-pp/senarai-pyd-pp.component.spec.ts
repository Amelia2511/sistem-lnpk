import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPydPpComponent } from './senarai-pyd-pp.component';

describe('SenaraiPydPpComponent', () => {
  let component: SenaraiPydPpComponent;
  let fixture: ComponentFixture<SenaraiPydPpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPydPpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPydPpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
