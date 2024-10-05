import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSaleMComponent } from './add-new-sale-m.component';

describe('AddNewSaleMComponent', () => {
  let component: AddNewSaleMComponent;
  let fixture: ComponentFixture<AddNewSaleMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSaleMComponent]
    });
    fixture = TestBed.createComponent(AddNewSaleMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
