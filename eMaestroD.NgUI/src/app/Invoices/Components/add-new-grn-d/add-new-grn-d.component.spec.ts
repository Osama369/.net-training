import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGrnDComponent } from './add-new-grn-d.component';

describe('AddNewGrnDComponent', () => {
  let component: AddNewGrnDComponent;
  let fixture: ComponentFixture<AddNewGrnDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewGrnDComponent]
    });
    fixture = TestBed.createComponent(AddNewGrnDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
