import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceInvoiceComponent } from './add-service-invoice.component';

describe('AddServiceInvoiceComponent', () => {
  let component: AddServiceInvoiceComponent;
  let fixture: ComponentFixture<AddServiceInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceInvoiceComponent]
    });
    fixture = TestBed.createComponent(AddServiceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
