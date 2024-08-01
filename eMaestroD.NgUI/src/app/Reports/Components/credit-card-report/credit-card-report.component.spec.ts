import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardReportComponent } from './credit-card-report.component';

describe('CreditCardReportComponent', () => {
  let component: CreditCardReportComponent;
  let fixture: ComponentFixture<CreditCardReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardReportComponent]
    });
    fixture = TestBed.createComponent(CreditCardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
