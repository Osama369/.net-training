import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBankComponent } from './add-new-bank.component';

describe('AddNewBankComponent', () => {
  let component: AddNewBankComponent;
  let fixture: ComponentFixture<AddNewBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBankComponent]
    });
    fixture = TestBed.createComponent(AddNewBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
