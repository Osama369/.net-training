import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGridDynamicComponent } from './report-grid-dynamic.component';

describe('ReportGridDynamicComponent', () => {
  let component: ReportGridDynamicComponent;
  let fixture: ComponentFixture<ReportGridDynamicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportGridDynamicComponent]
    });
    fixture = TestBed.createComponent(ReportGridDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
