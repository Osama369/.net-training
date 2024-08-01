import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxReportByCustomerComponent } from './tax-report-by-customer.component';

describe('TaxReportByCustomerComponent', () => {
  let component: TaxReportByCustomerComponent;
  let fixture: ComponentFixture<TaxReportByCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxReportByCustomerComponent]
    });
    fixture = TestBed.createComponent(TaxReportByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
