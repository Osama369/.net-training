import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSaleDComponent } from './add-new-sale-d.component';

describe('AddNewSaleDComponent', () => {
  let component: AddNewSaleDComponent;
  let fixture: ComponentFixture<AddNewSaleDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSaleDComponent]
    });
    fixture = TestBed.createComponent(AddNewSaleDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
