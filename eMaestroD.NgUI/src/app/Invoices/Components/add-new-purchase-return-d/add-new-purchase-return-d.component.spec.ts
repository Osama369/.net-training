import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseReturnDComponent } from './add-new-purchase-return-d.component';

describe('AddNewPurchaseReturnDComponent', () => {
  let component: AddNewPurchaseReturnDComponent;
  let fixture: ComponentFixture<AddNewPurchaseReturnDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseReturnDComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseReturnDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
