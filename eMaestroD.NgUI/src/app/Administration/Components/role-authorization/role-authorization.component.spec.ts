import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAuthorizationComponent } from './role-authorization.component';

describe('RoleAuthorizationComponent', () => {
  let component: RoleAuthorizationComponent;
  let fixture: ComponentFixture<RoleAuthorizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleAuthorizationComponent]
    });
    fixture = TestBed.createComponent(RoleAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
