import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStatusCommulativeValuationComponent } from './stock-status-commulative-valuation.component';

describe('StockStatusCommulativeValuationComponent', () => {
  let component: StockStatusCommulativeValuationComponent;
  let fixture: ComponentFixture<StockStatusCommulativeValuationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockStatusCommulativeValuationComponent]
    });
    fixture = TestBed.createComponent(StockStatusCommulativeValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
