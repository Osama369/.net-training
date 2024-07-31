import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COAComponent } from './coa.component';

describe('COAComponent', () => {
  let component: COAComponent;
  let fixture: ComponentFixture<COAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [COAComponent]
    });
    fixture = TestBed.createComponent(COAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
