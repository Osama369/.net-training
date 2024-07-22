import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyledgerComponent } from './partyledger.component';

describe('PartyledgerComponent', () => {
  let component: PartyledgerComponent;
  let fixture: ComponentFixture<PartyledgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyledgerComponent]
    });
    fixture = TestBed.createComponent(PartyledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
