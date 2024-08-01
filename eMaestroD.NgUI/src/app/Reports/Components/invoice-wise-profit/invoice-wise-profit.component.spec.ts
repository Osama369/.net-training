import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceWiseProfitComponent } from './invoice-wise-profit.component';

describe('InvoiceWiseProfitComponent', () => {
  let component: InvoiceWiseProfitComponent;
  let fixture: ComponentFixture<InvoiceWiseProfitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceWiseProfitComponent]
    });
    fixture = TestBed.createComponent(InvoiceWiseProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
