import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGirdTreeTableComponent } from './report-gird-tree-table.component';

describe('ReportGirdTreeTableComponent', () => {
  let component: ReportGirdTreeTableComponent;
  let fixture: ComponentFixture<ReportGirdTreeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportGirdTreeTableComponent]
    });
    fixture = TestBed.createComponent(ReportGirdTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
