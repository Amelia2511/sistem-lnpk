import { TestBed } from '@angular/core/testing';

import { PpsmService } from './ppsm.service';

describe('PpsmService', () => {
  let service: PpsmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpsmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
