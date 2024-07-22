import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewExpenseVoucherComponent } from './add-new-expense-voucher.component';

describe('AddNewExpenseVoucherComponent', () => {
  let component: AddNewExpenseVoucherComponent;
  let fixture: ComponentFixture<AddNewExpenseVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewExpenseVoucherComponent]
    });
    fixture = TestBed.createComponent(AddNewExpenseVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
