import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPaymentVoucherComponent } from './add-new-payment-voucher.component';

describe('AddNewPaymentVoucherComponent', () => {
  let component: AddNewPaymentVoucherComponent;
  let fixture: ComponentFixture<AddNewPaymentVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPaymentVoucherComponent]
    });
    fixture = TestBed.createComponent(AddNewPaymentVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
