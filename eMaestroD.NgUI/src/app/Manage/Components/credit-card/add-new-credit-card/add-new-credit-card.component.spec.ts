import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCreditCardComponent } from './add-new-credit-card.component';

describe('AddNewCreditCardComponent', () => {
  let component: AddNewCreditCardComponent;
  let fixture: ComponentFixture<AddNewCreditCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCreditCardComponent]
    });
    fixture = TestBed.createComponent(AddNewCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
