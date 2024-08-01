import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPayableComponent } from './accounts-payable.component';

describe('AccountsPayableComponent', () => {
  let component: AccountsPayableComponent;
  let fixture: ComponentFixture<AccountsPayableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsPayableComponent]
    });
    fixture = TestBed.createComponent(AccountsPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
