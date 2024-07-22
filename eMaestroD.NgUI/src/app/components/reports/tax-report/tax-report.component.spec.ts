import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxReportComponent } from './tax-report.component';

describe('TaxReportComponent', () => {
  let component: TaxReportComponent;
  let fixture: ComponentFixture<TaxReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxReportComponent]
    });
    fixture = TestBed.createComponent(TaxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
