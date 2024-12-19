import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptJournalComponent } from './receipt-journal.component';

describe('ReceiptJournalComponent', () => {
  let component: ReceiptJournalComponent;
  let fixture: ComponentFixture<ReceiptJournalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptJournalComponent]
    });
    fixture = TestBed.createComponent(ReceiptJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
