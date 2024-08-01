import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalesReportComponent } from './monthly-sales-report.component';

describe('MonthlySalesReportComponent', () => {
  let component: MonthlySalesReportComponent;
  let fixture: ComponentFixture<MonthlySalesReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlySalesReportComponent]
    });
    fixture = TestBed.createComponent(MonthlySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
