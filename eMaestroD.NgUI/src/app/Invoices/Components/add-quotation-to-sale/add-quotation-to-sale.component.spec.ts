import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuotationToSaleComponent } from './add-quotation-to-sale.component';

describe('AddQuotationToSaleComponent', () => {
  let component: AddQuotationToSaleComponent;
  let fixture: ComponentFixture<AddQuotationToSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddQuotationToSaleComponent]
    });
    fixture = TestBed.createComponent(AddQuotationToSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
