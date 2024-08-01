import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseReturnComponent } from './add-purchase-return.component';

describe('AddPurchaseReturnComponent', () => {
  let component: AddPurchaseReturnComponent;
  let fixture: ComponentFixture<AddPurchaseReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPurchaseReturnComponent]
    });
    fixture = TestBed.createComponent(AddPurchaseReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
