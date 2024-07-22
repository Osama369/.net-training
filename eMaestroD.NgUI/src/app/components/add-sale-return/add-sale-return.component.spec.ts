import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSaleReturnComponent } from './add-sale-return.component';

describe('AddSaleReturnComponent', () => {
  let component: AddSaleReturnComponent;
  let fixture: ComponentFixture<AddSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSaleReturnComponent]
    });
    fixture = TestBed.createComponent(AddSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
