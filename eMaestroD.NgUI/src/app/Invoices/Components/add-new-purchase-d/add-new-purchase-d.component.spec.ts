import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPurchaseDComponent } from './add-new-purchase-d.component';

describe('AddNewPurchaseDComponent', () => {
  let component: AddNewPurchaseDComponent;
  let fixture: ComponentFixture<AddNewPurchaseDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPurchaseDComponent]
    });
    fixture = TestBed.createComponent(AddNewPurchaseDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
