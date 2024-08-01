import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVoucherComponent } from './receipt-voucher.component';

describe('ReceiptVoucherComponent', () => {
  let component: ReceiptVoucherComponent;
  let fixture: ComponentFixture<ReceiptVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptVoucherComponent]
    });
    fixture = TestBed.createComponent(ReceiptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
