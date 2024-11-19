import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnMComponent } from './purchase-return-m.component';

describe('PurchaseReturnMComponent', () => {
  let component: PurchaseReturnMComponent;
  let fixture: ComponentFixture<PurchaseReturnMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseReturnMComponent]
    });
    fixture = TestBed.createComponent(PurchaseReturnMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
