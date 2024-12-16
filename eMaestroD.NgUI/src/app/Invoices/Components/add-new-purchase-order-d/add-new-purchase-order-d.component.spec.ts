import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseOrderDComponent } from './add-new-purchase-order-d.component';

describe('AddNewPurchaseOrderDComponent', () => {
  let component: AddNewPurchaseOrderDComponent;
  let fixture: ComponentFixture<AddNewPurchaseOrderDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseOrderDComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseOrderDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
