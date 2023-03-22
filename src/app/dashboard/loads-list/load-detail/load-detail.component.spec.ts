import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailComponent } from './load-detail.component';

describe('LoadDetailComponent', () => {
  let component: LoadDetailComponent;
  let fixture: ComponentFixture<LoadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
