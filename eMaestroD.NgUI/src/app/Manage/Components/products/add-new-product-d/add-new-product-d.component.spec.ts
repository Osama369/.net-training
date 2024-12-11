import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProductDComponent } from './add-new-product-d.component';

describe('AddNewProductDComponent', () => {
  let component: AddNewProductDComponent;
  let fixture: ComponentFixture<AddNewProductDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewProductDComponent]
    });
    fixture = TestBed.createComponent(AddNewProductDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
