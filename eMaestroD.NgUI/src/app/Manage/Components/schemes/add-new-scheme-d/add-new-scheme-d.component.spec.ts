import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSchemeDComponent } from './add-new-scheme-d.component';

describe('AddNewSchemeDComponent', () => {
  let component: AddNewSchemeDComponent;
  let fixture: ComponentFixture<AddNewSchemeDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewSchemeDComponent]
    });
    fixture = TestBed.createComponent(AddNewSchemeDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
