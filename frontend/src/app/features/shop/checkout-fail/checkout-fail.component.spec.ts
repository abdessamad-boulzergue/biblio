import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutFailComponent } from './checkout-fail.component';

describe('CheckoutFailComponent', () => {
  let component: CheckoutFailComponent;
  let fixture: ComponentFixture<CheckoutFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
