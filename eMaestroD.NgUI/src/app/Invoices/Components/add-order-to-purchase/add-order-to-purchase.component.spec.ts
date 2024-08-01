import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderToPurchaseComponent } from './add-order-to-purchase.component';

describe('AddOrderToPurchaseComponent', () => {
  let component: AddOrderToPurchaseComponent;
  let fixture: ComponentFixture<AddOrderToPurchaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrderToPurchaseComponent]
    });
    fixture = TestBed.createComponent(AddOrderToPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
