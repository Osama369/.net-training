import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSRWithAvailabilityComponent } from './ssrwith-availability.component';

describe('SSRWithAvailabilityComponent', () => {
  let component: SSRWithAvailabilityComponent;
  let fixture: ComponentFixture<SSRWithAvailabilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SSRWithAvailabilityComponent]
    });
    fixture = TestBed.createComponent(SSRWithAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
