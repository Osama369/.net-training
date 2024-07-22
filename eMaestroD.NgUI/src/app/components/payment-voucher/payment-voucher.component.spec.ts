import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherComponent } from './payment-voucher.component';

describe('PaymentVoucherComponent', () => {
  let component: PaymentVoucherComponent;
  let fixture: ComponentFixture<PaymentVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentVoucherComponent]
    });
    fixture = TestBed.createComponent(PaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
