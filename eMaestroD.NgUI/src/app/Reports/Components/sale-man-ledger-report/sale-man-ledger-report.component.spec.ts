import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleManLedgerReportComponent } from './sale-man-ledger-report.component';

describe('SaleManLedgerReportComponent', () => {
  let component: SaleManLedgerReportComponent;
  let fixture: ComponentFixture<SaleManLedgerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleManLedgerReportComponent]
    });
    fixture = TestBed.createComponent(SaleManLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
