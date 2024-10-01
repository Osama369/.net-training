import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMComponent } from './purchase-m.component';

describe('PurchaseMComponent', () => {
  let component: PurchaseMComponent;
  let fixture: ComponentFixture<PurchaseMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseMComponent]
    });
    fixture = TestBed.createComponent(PurchaseMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
