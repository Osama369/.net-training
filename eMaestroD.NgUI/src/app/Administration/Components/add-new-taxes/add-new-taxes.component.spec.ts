import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTaxesComponent } from './add-new-taxes.component';

describe('AddNewTaxesComponent', () => {
  let component: AddNewTaxesComponent;
  let fixture: ComponentFixture<AddNewTaxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewTaxesComponent]
    });
    fixture = TestBed.createComponent(AddNewTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
