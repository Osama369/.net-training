import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableAgingComponent } from './payable-aging.component';

describe('PayableAgingComponent', () => {
  let component: PayableAgingComponent;
  let fixture: ComponentFixture<PayableAgingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayableAgingComponent]
    });
    fixture = TestBed.createComponent(PayableAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
