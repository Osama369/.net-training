import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountClaimComponent } from './discount-claim.component';

describe('DiscountClaimComponent', () => {
  let component: DiscountClaimComponent;
  let fixture: ComponentFixture<DiscountClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountClaimComponent]
    });
    fixture = TestBed.createComponent(DiscountClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
