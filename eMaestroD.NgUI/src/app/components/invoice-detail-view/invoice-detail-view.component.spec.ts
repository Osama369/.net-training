import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailViewComponent } from './invoice-detail-view.component';

describe('DetailViewComponent', () => {
  let component: InvoiceDetailViewComponent;
  let fixture: ComponentFixture<InvoiceDetailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceDetailViewComponent]
    });
    fixture = TestBed.createComponent(InvoiceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
