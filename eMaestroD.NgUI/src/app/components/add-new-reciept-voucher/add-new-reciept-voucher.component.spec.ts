import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRecieptVoucherComponent } from './add-new-reciept-voucher.component';

describe('RecieptVoucherComponent', () => {
  let component: AddNewRecieptVoucherComponent;
  let fixture: ComponentFixture<AddNewRecieptVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewRecieptVoucherComponent]
    });
    fixture = TestBed.createComponent(AddNewRecieptVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
