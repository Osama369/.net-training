import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivableAgingComponent } from './receivable-aging.component';

describe('ReceivableAgingComponent', () => {
  let component: ReceivableAgingComponent;
  let fixture: ComponentFixture<ReceivableAgingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivableAgingComponent]
    });
    fixture = TestBed.createComponent(ReceivableAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
