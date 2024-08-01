import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBulkStockUpdateComponent } from './add-new-bulk-stock-update.component';

describe('AddNewBulkStockUpdateComponent', () => {
  let component: AddNewBulkStockUpdateComponent;
  let fixture: ComponentFixture<AddNewBulkStockUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBulkStockUpdateComponent]
    });
    fixture = TestBed.createComponent(AddNewBulkStockUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
