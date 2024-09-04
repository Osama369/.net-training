import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCategoryComponent } from './add-new-category.component';

describe('AddNewCategoryComponent', () => {
  let component: AddNewCategoryComponent;
  let fixture: ComponentFixture<AddNewCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCategoryComponent]
    });
    fixture = TestBed.createComponent(AddNewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
