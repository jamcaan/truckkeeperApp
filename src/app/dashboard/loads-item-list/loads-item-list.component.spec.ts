import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadsItemListComponent } from './loads-item-list.component';

describe('LoadsItemListComponent', () => {
  let component: LoadsItemListComponent;
  let fixture: ComponentFixture<LoadsItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadsItemListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadsItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
