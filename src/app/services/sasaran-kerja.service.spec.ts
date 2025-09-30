import { TestBed } from '@angular/core/testing';

import { SasaranKerjaService } from './sasaran-kerja.service';

describe('SasaranKerjaService', () => {
  let service: SasaranKerjaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SasaranKerjaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
