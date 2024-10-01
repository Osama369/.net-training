import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GRNComponent } from './grn.component';

describe('GRNComponent', () => {
  let component: GRNComponent;
  let fixture: ComponentFixture<GRNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GRNComponent]
    });
    fixture = TestBed.createComponent(GRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
