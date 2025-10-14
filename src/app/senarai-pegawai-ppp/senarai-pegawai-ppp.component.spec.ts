import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPegawaiPppComponent } from './senarai-pegawai-ppp.component';

describe('SenaraiPegawaiPppComponent', () => {
  let component: SenaraiPegawaiPppComponent;
  let fixture: ComponentFixture<SenaraiPegawaiPppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPegawaiPppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPegawaiPppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
