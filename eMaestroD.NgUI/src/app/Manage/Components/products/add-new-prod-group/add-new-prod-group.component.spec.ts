import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProdGroupComponent } from './add-new-prod-group.component';

describe('AddNewProdGroupComponent', () => {
  let component: AddNewProdGroupComponent;
  let fixture: ComponentFixture<AddNewProdGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewProdGroupComponent]
    });
    fixture = TestBed.createComponent(AddNewProdGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
