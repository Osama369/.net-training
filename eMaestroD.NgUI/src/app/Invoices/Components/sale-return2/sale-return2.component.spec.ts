import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReturn2Component } from './sale-return2.component';

describe('SaleReturn2Component', () => {
  let component: SaleReturn2Component;
  let fixture: ComponentFixture<SaleReturn2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleReturn2Component]
    });
    fixture = TestBed.createComponent(SaleReturn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
