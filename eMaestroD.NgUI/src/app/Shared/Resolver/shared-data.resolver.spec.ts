import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { sharedDataResolver } from './shared-data.resolver';

describe('sharedDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => sharedDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
