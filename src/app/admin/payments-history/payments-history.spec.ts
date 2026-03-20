import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsHistoryComponent } from './payments-history';

describe('PaymentsHistory', () => {
  let component: PaymentsHistoryComponent;
  let fixture: ComponentFixture<PaymentsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
