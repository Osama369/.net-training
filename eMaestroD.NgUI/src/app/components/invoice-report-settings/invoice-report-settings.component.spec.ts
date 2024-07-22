import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReportSettingsComponent } from './invoice-report-settings.component';

describe('InvoiceReportSettingsComponent', () => {
  let component: InvoiceReportSettingsComponent;
  let fixture: ComponentFixture<InvoiceReportSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceReportSettingsComponent]
    });
    fixture = TestBed.createComponent(InvoiceReportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
