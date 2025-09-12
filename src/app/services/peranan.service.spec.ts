import { TestBed } from '@angular/core/testing';

import { PerananService } from './peranan.service';

describe('PerananService', () => {
  let service: PerananService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerananService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
