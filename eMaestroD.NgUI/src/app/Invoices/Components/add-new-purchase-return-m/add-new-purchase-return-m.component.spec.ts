import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseReturnMComponent } from './add-new-purchase-return-m.component';

describe('AddNewPurchaseReturnMComponent', () => {
  let component: AddNewPurchaseReturnMComponent;
  let fixture: ComponentFixture<AddNewPurchaseReturnMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseReturnMComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseReturnMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
