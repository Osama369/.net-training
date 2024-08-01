import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCustomerForInvoiceComponent } from './add-new-customer-for-invoice.component';

describe('AddNewCustomerForInvoiceComponent', () => {
  let component: AddNewCustomerForInvoiceComponent;
  let fixture: ComponentFixture<AddNewCustomerForInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCustomerForInvoiceComponent]
    });
    fixture = TestBed.createComponent(AddNewCustomerForInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
