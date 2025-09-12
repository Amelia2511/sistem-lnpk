import { TestBed } from '@angular/core/testing';

import { PydService } from './pyd.service';

describe('PydService', () => {
  let service: PydService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PydService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
