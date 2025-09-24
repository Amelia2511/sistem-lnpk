import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPenilaianComponent } from './senarai-penilaian.component';

describe('SenaraiPenilaianComponent', () => {
  let component: SenaraiPenilaianComponent;
  let fixture: ComponentFixture<SenaraiPenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
