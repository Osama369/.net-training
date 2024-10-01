import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseMComponent } from './add-new-purchase-m.component';

describe('AddNewPurchaseMComponent', () => {
  let component: AddNewPurchaseMComponent;
  let fixture: ComponentFixture<AddNewPurchaseMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseMComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
