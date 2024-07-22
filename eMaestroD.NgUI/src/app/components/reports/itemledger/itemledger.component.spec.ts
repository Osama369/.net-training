import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemledgerComponent } from './itemledger.component';

describe('ItemledgerComponent', () => {
  let component: ItemledgerComponent;
  let fixture: ComponentFixture<ItemledgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemledgerComponent]
    });
    fixture = TestBed.createComponent(ItemledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
