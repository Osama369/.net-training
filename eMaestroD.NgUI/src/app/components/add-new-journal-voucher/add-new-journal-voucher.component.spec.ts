import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewJournalVoucherComponent } from './add-new-journal-voucher.component';

describe('AddNewJournalVoucherComponent', () => {
  let component: AddNewJournalVoucherComponent;
  let fixture: ComponentFixture<AddNewJournalVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewJournalVoucherComponent]
    });
    fixture = TestBed.createComponent(AddNewJournalVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
