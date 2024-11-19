import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePostingComponent } from './invoice-posting.component';

describe('InvoicePostingComponent', () => {
  let component: InvoicePostingComponent;
  let fixture: ComponentFixture<InvoicePostingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoicePostingComponent]
    });
    fixture = TestBed.createComponent(InvoicePostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
