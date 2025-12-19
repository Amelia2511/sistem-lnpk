import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPenilaianPydComponent } from './senarai-penilaian-pyd.component';

describe('SenaraiPenilaianPydComponent', () => {
  let component: SenaraiPenilaianPydComponent;
  let fixture: ComponentFixture<SenaraiPenilaianPydComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPenilaianPydComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPenilaianPydComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
