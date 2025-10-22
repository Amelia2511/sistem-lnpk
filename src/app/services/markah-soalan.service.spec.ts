import { TestBed } from '@angular/core/testing';

import { MarkahSoalanService } from './markah-soalan.service';

describe('MarkahSoalanService', () => {
  let service: MarkahSoalanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkahSoalanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
