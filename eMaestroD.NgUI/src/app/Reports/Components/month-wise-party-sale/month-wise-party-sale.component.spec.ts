import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWisePartySaleComponent } from './month-wise-party-sale.component';

describe('MonthWisePartySaleComponent', () => {
  let component: MonthWisePartySaleComponent;
  let fixture: ComponentFixture<MonthWisePartySaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthWisePartySaleComponent]
    });
    fixture = TestBed.createComponent(MonthWisePartySaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
