import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGrnComponent } from './add-new-grn.component';

describe('AddNewGrnComponent', () => {
  let component: AddNewGrnComponent;
  let fixture: ComponentFixture<AddNewGrnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewGrnComponent]
    });
    fixture = TestBed.createComponent(AddNewGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
