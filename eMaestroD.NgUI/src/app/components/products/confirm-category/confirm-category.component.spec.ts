import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCategoryComponent } from './confirm-category.component';

describe('ConfirmCategoryComponent', () => {
  let component: ConfirmCategoryComponent;
  let fixture: ComponentFixture<ConfirmCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmCategoryComponent]
    });
    fixture = TestBed.createComponent(ConfirmCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
