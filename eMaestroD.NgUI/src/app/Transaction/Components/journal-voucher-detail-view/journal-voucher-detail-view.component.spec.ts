import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVoucherDetailViewComponent } from './journal-voucher-detail-view.component';

describe('JournalVoucherDetailViewComponent', () => {
  let component: JournalVoucherDetailViewComponent;
  let fixture: ComponentFixture<JournalVoucherDetailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalVoucherDetailViewComponent]
    });
    fixture = TestBed.createComponent(JournalVoucherDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
