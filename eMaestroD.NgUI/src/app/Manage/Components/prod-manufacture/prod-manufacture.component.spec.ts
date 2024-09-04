import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdManufactureComponent } from './prod-manufacture.component';

describe('ProdManufactureComponent', () => {
  let component: ProdManufactureComponent;
  let fixture: ComponentFixture<ProdManufactureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdManufactureComponent]
    });
    fixture = TestBed.createComponent(ProdManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
