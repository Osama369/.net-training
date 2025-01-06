import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MseCompanyWiseSaleComponent } from './mse-company-wise-sale.component';

describe('MseCompanyWiseSaleComponent', () => {
  let component: MseCompanyWiseSaleComponent;
  let fixture: ComponentFixture<MseCompanyWiseSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MseCompanyWiseSaleComponent]
    });
    fixture = TestBed.createComponent(MseCompanyWiseSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
