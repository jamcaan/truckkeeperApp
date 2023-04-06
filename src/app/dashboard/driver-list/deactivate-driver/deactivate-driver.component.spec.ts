import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateDriverComponent } from './deactivate-driver.component';

describe('DeactivateDriverComponent', () => {
  let component: DeactivateDriverComponent;
  let fixture: ComponentFixture<DeactivateDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactivateDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
