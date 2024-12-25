import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMSEComponent } from './add-new-mse.component';

describe('AddNewMSEComponent', () => {
  let component: AddNewMSEComponent;
  let fixture: ComponentFixture<AddNewMSEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewMSEComponent]
    });
    fixture = TestBed.createComponent(AddNewMSEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
