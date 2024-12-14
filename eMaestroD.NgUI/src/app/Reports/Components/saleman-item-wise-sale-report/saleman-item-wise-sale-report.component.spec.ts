import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalemanItemWiseSaleReportComponent } from './saleman-item-wise-sale-report.component';

describe('SalemanItemWiseSaleReportComponent', () => {
  let component: SalemanItemWiseSaleReportComponent;
  let fixture: ComponentFixture<SalemanItemWiseSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalemanItemWiseSaleReportComponent]
    });
    fixture = TestBed.createComponent(SalemanItemWiseSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
