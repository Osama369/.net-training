import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchReportComponent } from './advanced-search-report.component';

describe('AdvancedSearchReportComponent', () => {
  let component: AdvancedSearchReportComponent;
  let fixture: ComponentFixture<AdvancedSearchReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedSearchReportComponent]
    });
    fixture = TestBed.createComponent(AdvancedSearchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
