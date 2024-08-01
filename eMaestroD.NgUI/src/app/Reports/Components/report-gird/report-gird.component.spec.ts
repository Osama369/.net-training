import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGirdComponent } from './report-gird.component';

describe('ReportGirdComponent', () => {
  let component: ReportGirdComponent;
  let fixture: ComponentFixture<ReportGirdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportGirdComponent]
    });
    fixture = TestBed.createComponent(ReportGirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
