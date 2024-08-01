import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoiceComponent } from './addnewsale.component';

describe('NewInvoiceComponent', () => {
  let component: NewInvoiceComponent;
  let fixture: ComponentFixture<NewInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewInvoiceComponent]
    });
    fixture = TestBed.createComponent(NewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
