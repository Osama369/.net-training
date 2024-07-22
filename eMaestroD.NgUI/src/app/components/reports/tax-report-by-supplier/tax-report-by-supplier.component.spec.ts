import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxReportBySupplierComponent } from './tax-report-by-supplier.component';

describe('TaxReportBySupplierComponent', () => {
  let component: TaxReportBySupplierComponent;
  let fixture: ComponentFixture<TaxReportBySupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxReportBySupplierComponent]
    });
    fixture = TestBed.createComponent(TaxReportBySupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
