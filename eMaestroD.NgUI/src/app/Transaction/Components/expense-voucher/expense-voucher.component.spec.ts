import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseVoucherComponent } from './expense-voucher.component';

describe('ExpenseVoucherComponent', () => {
  let component: ExpenseVoucherComponent;
  let fixture: ComponentFixture<ExpenseVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseVoucherComponent]
    });
    fixture = TestBed.createComponent(ExpenseVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
