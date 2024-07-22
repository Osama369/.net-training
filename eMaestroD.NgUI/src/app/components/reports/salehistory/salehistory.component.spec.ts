import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalehistoryComponent } from './salehistory.component';

describe('SalehistoryComponent', () => {
  let component: SalehistoryComponent;
  let fixture: ComponentFixture<SalehistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalehistoryComponent]
    });
    fixture = TestBed.createComponent(SalehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
