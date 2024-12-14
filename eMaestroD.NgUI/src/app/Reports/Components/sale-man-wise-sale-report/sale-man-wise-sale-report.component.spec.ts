import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleManWiseSaleReportComponent } from './sale-man-wise-sale-report.component';

describe('SaleManWiseSaleReportComponent', () => {
  let component: SaleManWiseSaleReportComponent;
  let fixture: ComponentFixture<SaleManWiseSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleManWiseSaleReportComponent]
    });
    fixture = TestBed.createComponent(SaleManWiseSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
