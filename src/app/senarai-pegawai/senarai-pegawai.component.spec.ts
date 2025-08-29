import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenaraiPegawaiComponent } from './senarai-pegawai.component';

describe('SenaraiPegawaiComponent', () => {
  let component: SenaraiPegawaiComponent;
  let fixture: ComponentFixture<SenaraiPegawaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenaraiPegawaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenaraiPegawaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
