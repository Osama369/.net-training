import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockShortageComponent } from './stock-shortage.component';

describe('StockShortageComponent', () => {
  let component: StockShortageComponent;
  let fixture: ComponentFixture<StockShortageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockShortageComponent]
    });
    fixture = TestBed.createComponent(StockShortageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
