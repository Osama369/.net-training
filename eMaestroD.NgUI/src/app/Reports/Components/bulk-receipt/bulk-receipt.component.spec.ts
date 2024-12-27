import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReceiptComponent } from './bulk-receipt.component';

describe('BulkReceiptComponent', () => {
  let component: BulkReceiptComponent;
  let fixture: ComponentFixture<BulkReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkReceiptComponent]
    });
    fixture = TestBed.createComponent(BulkReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
