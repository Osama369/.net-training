import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDetailViewComponent } from './voucher-detail-view.component';

describe('VoucherDetailViewComponent', () => {
  let component: VoucherDetailViewComponent;
  let fixture: ComponentFixture<VoucherDetailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherDetailViewComponent]
    });
    fixture = TestBed.createComponent(VoucherDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
