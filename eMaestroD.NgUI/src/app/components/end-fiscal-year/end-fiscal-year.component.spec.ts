import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndFiscalYearComponent } from './end-fiscal-year.component';

describe('EndFiscalYearComponent', () => {
  let component: EndFiscalYearComponent;
  let fixture: ComponentFixture<EndFiscalYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndFiscalYearComponent]
    });
    fixture = TestBed.createComponent(EndFiscalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
