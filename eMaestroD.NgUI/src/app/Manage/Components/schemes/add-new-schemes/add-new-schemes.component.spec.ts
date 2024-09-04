import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSchemesComponent } from './add-new-schemes.component';

describe('AddNewSchemesComponent', () => {
  let component: AddNewSchemesComponent;
  let fixture: ComponentFixture<AddNewSchemesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSchemesComponent]
    });
    fixture = TestBed.createComponent(AddNewSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
