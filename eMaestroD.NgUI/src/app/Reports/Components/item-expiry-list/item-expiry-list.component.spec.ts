import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExpiryListComponent } from './item-expiry-list.component';

describe('ItemExpiryListComponent', () => {
  let component: ItemExpiryListComponent;
  let fixture: ComponentFixture<ItemExpiryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemExpiryListComponent]
    });
    fixture = TestBed.createComponent(ItemExpiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
