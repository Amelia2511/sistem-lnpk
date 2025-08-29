import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TambahSktComponent } from './tambah-skt.component';

describe('TambahSktComponent', () => {
  let component: TambahSktComponent;
  let fixture: ComponentFixture<TambahSktComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TambahSktComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TambahSktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
