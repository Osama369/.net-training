import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturn2Component } from './purchase-return2.component';

describe('PurchaseReturn2Component', () => {
  let component: PurchaseReturn2Component;
  let fixture: ComponentFixture<PurchaseReturn2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseReturn2Component]
    });
    fixture = TestBed.createComponent(PurchaseReturn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
