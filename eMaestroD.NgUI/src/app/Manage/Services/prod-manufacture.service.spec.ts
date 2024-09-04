import { TestBed } from '@angular/core/testing';

import { ProdManufactureService } from './prod-manufacture.service';

describe('ProdManufactureService', () => {
  let service: ProdManufactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdManufactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
