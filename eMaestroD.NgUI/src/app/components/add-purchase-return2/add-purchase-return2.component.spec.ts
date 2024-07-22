import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseReturn2Component } from './add-purchase-return2.component';

describe('AddPurchaseReturn2Component', () => {
  let component: AddPurchaseReturn2Component;
  let fixture: ComponentFixture<AddPurchaseReturn2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPurchaseReturn2Component]
    });
    fixture = TestBed.createComponent(AddPurchaseReturn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
