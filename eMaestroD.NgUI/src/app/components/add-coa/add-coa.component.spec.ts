import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoaComponent } from './add-coa.component';

describe('AddCoaComponent', () => {
  let component: AddCoaComponent;
  let fixture: ComponentFixture<AddCoaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCoaComponent]
    });
    fixture = TestBed.createComponent(AddCoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
