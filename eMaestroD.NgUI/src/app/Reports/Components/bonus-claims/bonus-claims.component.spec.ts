import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusClaimsComponent } from './bonus-claims.component';

describe('BonusClaimsComponent', () => {
  let component: BonusClaimsComponent;
  let fixture: ComponentFixture<BonusClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusClaimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
