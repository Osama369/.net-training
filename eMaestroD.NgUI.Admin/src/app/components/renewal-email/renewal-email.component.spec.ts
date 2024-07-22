import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalEmailComponent } from './renewal-email.component';

describe('RenewalEmailComponent', () => {
  let component: RenewalEmailComponent;
  let fixture: ComponentFixture<RenewalEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewalEmailComponent]
    });
    fixture = TestBed.createComponent(RenewalEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
