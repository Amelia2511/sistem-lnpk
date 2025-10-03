import { TestBed } from '@angular/core/testing';

import { PenilaianService } from './penilaian.service';

describe('PenilaianService', () => {
  let service: PenilaianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenilaianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
