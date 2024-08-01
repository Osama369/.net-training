import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorledgerComponent } from './vendorledger.component';

describe('VendorledgerComponent', () => {
  let component: VendorledgerComponent;
  let fixture: ComponentFixture<VendorledgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorledgerComponent]
    });
    fixture = TestBed.createComponent(VendorledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
