import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSaleReturn2Component } from './add-sale-return2.component';

describe('AddSaleReturn2Component', () => {
  let component: AddSaleReturn2Component;
  let fixture: ComponentFixture<AddSaleReturn2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSaleReturn2Component]
    });
    fixture = TestBed.createComponent(AddSaleReturn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
