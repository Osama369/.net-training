import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMseComponent } from './company-mse.component';

describe('CompanyMseComponent', () => {
  let component: CompanyMseComponent;
  let fixture: ComponentFixture<CompanyMseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyMseComponent]
    });
    fixture = TestBed.createComponent(CompanyMseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
