import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { sktMetaResolver } from './skt-meta.resolver';

describe('sktMetaResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => sktMetaResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
