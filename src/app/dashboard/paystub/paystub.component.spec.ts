import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaystubComponent } from './paystub.component';

describe('PaystubComponent', () => {
  let component: PaystubComponent;
  let fixture: ComponentFixture<PaystubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaystubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaystubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
