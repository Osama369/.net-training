import { TestBed } from '@angular/core/testing';

import { CompanyCSEService } from './company-cse.service';

describe('CompanyCSEService', () => {
  let service: CompanyCSEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyCSEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
