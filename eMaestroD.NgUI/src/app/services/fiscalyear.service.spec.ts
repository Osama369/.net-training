import { TestBed } from '@angular/core/testing';

import { FiscalyearService } from './fiscalyear.service';

describe('FiscalyearService', () => {
  let service: FiscalyearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiscalyearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
