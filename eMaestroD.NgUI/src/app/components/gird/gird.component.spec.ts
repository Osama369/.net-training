import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirdComponent } from './gird.component';

describe('GirdComponent', () => {
  let component: GirdComponent;
  let fixture: ComponentFixture<GirdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GirdComponent]
    });
    fixture = TestBed.createComponent(GirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
