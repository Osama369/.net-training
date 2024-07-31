import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAlertComponent } from './notification-alert.component';

describe('NotificationAlertComponent', () => {
  let component: NotificationAlertComponent;
  let fixture: ComponentFixture<NotificationAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationAlertComponent]
    });
    fixture = TestBed.createComponent(NotificationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
