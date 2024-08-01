import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksaleandreturnComponent } from './stocksaleandreturn.component';

describe('StocksaleandreturnComponent', () => {
  let component: StocksaleandreturnComponent;
  let fixture: ComponentFixture<StocksaleandreturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StocksaleandreturnComponent]
    });
    fixture = TestBed.createComponent(StocksaleandreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
