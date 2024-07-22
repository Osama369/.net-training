import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationInvoiceComponent } from './addNewQuotation.component';

describe('QuotationInvoiceComponent', () => {
  let component: QuotationInvoiceComponent;
  let fixture: ComponentFixture<QuotationInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationInvoiceComponent]
    });
    fixture = TestBed.createComponent(QuotationInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
