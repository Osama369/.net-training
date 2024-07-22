import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkStockUpdateComponent } from './bulk-stock-update.component';

describe('BulkStockUpdateComponent', () => {
  let component: BulkStockUpdateComponent;
  let fixture: ComponentFixture<BulkStockUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkStockUpdateComponent]
    });
    fixture = TestBed.createComponent(BulkStockUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
