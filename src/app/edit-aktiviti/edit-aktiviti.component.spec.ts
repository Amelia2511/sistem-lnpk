import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAktivitiComponent } from './edit-aktiviti.component';

describe('EditAktivitiComponent', () => {
  let component: EditAktivitiComponent;
  let fixture: ComponentFixture<EditAktivitiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAktivitiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAktivitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
