import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewScreenComponent } from './add-new-screen.component';

describe('AddNewScreenComponent', () => {
  let component: AddNewScreenComponent;
  let fixture: ComponentFixture<AddNewScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewScreenComponent]
    });
    fixture = TestBed.createComponent(AddNewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
