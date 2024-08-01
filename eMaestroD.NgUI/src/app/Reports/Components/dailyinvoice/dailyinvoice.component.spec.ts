import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyinvoiceComponent } from './dailyinvoice.component';

describe('DailyinvoiceComponent', () => {
  let component: DailyinvoiceComponent;
  let fixture: ComponentFixture<DailyinvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyinvoiceComponent]
    });
    fixture = TestBed.createComponent(DailyinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
