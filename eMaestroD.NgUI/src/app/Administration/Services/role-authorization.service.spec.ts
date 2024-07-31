import { TestBed } from '@angular/core/testing';

import { RoleAuthorizationService } from './role-authorization.service';

describe('RoleAuthorizationService', () => {
  let service: RoleAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
