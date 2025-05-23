import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderInvoiceComponent } from './render-invoice.component';

describe('RenderInvoiceComponent', () => {
  let component: RenderInvoiceComponent;
  let fixture: ComponentFixture<RenderInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenderInvoiceComponent]
    });
    fixture = TestBed.createComponent(RenderInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
