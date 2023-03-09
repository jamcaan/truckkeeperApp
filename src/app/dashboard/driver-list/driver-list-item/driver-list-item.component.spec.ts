import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverListItemComponent } from './driver-list-item.component';

describe('DriverListItemComponent', () => {
  let component: DriverListItemComponent;
  let fixture: ComponentFixture<DriverListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
