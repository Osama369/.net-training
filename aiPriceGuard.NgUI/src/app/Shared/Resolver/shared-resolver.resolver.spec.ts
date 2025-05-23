import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { sharedResolverResolver } from './shared-resolver.resolver';

describe('sharedResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => sharedResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
