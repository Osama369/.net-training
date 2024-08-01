import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitandlossComponent } from './profitandloss.component';

describe('ProfitandlossComponent', () => {
  let component: ProfitandlossComponent;
  let fixture: ComponentFixture<ProfitandlossComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitandlossComponent]
    });
    fixture = TestBed.createComponent(ProfitandlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
