import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPegawaiPaComponent } from './senarai-pegawai-pa.component';

describe('SenaraiPegawaiPaComponent', () => {
  let component: SenaraiPegawaiPaComponent;
  let fixture: ComponentFixture<SenaraiPegawaiPaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPegawaiPaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPegawaiPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
