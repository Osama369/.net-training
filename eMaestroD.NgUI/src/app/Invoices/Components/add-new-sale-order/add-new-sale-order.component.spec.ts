import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSaleOrderComponent } from './add-new-sale-order.component';

describe('AddNewSaleOrderComponent', () => {
  let component: AddNewSaleOrderComponent;
  let fixture: ComponentFixture<AddNewSaleOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSaleOrderComponent]
    });
    fixture = TestBed.createComponent(AddNewSaleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
