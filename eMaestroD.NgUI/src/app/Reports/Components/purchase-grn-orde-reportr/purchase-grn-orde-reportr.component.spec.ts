import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGrnOrdeReportrComponent } from './purchase-grn-orde-reportr.component';

describe('PurchaseGrnOrdeReportrComponent', () => {
  let component: PurchaseGrnOrdeReportrComponent;
  let fixture: ComponentFixture<PurchaseGrnOrdeReportrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseGrnOrdeReportrComponent]
    });
    fixture = TestBed.createComponent(PurchaseGrnOrdeReportrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
