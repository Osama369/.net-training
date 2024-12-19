import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSaleReturnDComponent } from './add-new-sale-return-d.component';

describe('AddNewSaleReturnDComponent', () => {
  let component: AddNewSaleReturnDComponent;
  let fixture: ComponentFixture<AddNewSaleReturnDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSaleReturnDComponent]
    });
    fixture = TestBed.createComponent(AddNewSaleReturnDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
