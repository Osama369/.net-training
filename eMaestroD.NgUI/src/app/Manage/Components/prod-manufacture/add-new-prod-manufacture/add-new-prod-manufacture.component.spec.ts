import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProdManufactureComponent } from './add-new-prod-manufacture.component';

describe('AddNewProdManufactureComponent', () => {
  let component: AddNewProdManufactureComponent;
  let fixture: ComponentFixture<AddNewProdManufactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewProdManufactureComponent]
    });
    fixture = TestBed.createComponent(AddNewProdManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
