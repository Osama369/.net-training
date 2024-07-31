import { TestBed } from '@angular/core/testing';

import { CoaService } from './coa.service';

describe('CoaService', () => {
  let service: CoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
