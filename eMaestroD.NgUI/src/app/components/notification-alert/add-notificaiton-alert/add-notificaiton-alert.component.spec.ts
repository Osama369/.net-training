import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificaitonAlertComponent } from './add-notificaiton-alert.component';

describe('AddNotificaitonAlertComponent', () => {
  let component: AddNotificaitonAlertComponent;
  let fixture: ComponentFixture<AddNotificaitonAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNotificaitonAlertComponent]
    });
    fixture = TestBed.createComponent(AddNotificaitonAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
