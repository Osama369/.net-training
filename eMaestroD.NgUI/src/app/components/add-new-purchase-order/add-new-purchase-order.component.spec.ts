import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseOrderComponent } from './add-new-purchase-order.component';

describe('AddNewPurchaseOrderComponent', () => {
  let component: AddNewPurchaseOrderComponent;
  let fixture: ComponentFixture<AddNewPurchaseOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseOrderComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
