import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationConfigComponent } from './location-config.component';

describe('LocationConfigComponent', () => {
  let component: LocationConfigComponent;
  let fixture: ComponentFixture<LocationConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationConfigComponent]
    });
    fixture = TestBed.createComponent(LocationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
