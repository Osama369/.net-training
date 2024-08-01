import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStockShortageComponent } from './add-new-stock-shortage.component';

describe('AddNewStockShortageComponent', () => {
  let component: AddNewStockShortageComponent;
  let fixture: ComponentFixture<AddNewStockShortageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewStockShortageComponent]
    });
    fixture = TestBed.createComponent(AddNewStockShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
