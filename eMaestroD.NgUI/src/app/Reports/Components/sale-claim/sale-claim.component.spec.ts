import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleClaimComponent } from './sale-claim.component';

describe('SaleClaimComponent', () => {
  let component: SaleClaimComponent;
  let fixture: ComponentFixture<SaleClaimComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleClaimComponent]
    });
    fixture = TestBed.createComponent(SaleClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
