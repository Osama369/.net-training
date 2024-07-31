import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFiscalYearComponent } from './add-new-fiscal-year.component';

describe('AddNewFiscalYearComponent', () => {
  let component: AddNewFiscalYearComponent;
  let fixture: ComponentFixture<AddNewFiscalYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewFiscalYearComponent]
    });
    fixture = TestBed.createComponent(AddNewFiscalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
