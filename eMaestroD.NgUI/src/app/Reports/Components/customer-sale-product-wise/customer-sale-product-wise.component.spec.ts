import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSaleProductWiseComponent } from './customer-sale-product-wise.component';

describe('CustomerSaleProductWiseComponent', () => {
  let component: CustomerSaleProductWiseComponent;
  let fixture: ComponentFixture<CustomerSaleProductWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerSaleProductWiseComponent]
    });
    fixture = TestBed.createComponent(CustomerSaleProductWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
