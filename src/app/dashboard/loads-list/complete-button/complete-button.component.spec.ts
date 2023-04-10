import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteButtonComponent } from './complete-button.component';

describe('CompleteButtonComponent', () => {
  let component: CompleteButtonComponent;
  let fixture: ComponentFixture<CompleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
