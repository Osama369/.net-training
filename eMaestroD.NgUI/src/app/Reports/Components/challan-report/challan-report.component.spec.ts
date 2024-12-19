import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanReportComponent } from './challan-report.component';

describe('ChallanReportComponent', () => {
  let component: ChallanReportComponent;
  let fixture: ComponentFixture<ChallanReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallanReportComponent]
    });
    fixture = TestBed.createComponent(ChallanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
