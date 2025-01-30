import { TestBed } from '@angular/core/testing';

import { ApiServiceFactoryService } from './api-service-factory.service';

describe('ApiServiceFactoryService', () => {
  let service: ApiServiceFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServiceFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
