import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailsDialogComponent } from './delivery-details-dialog.component';

describe('DeliveryDetailsDialogComponent', () => {
  let component: DeliveryDetailsDialogComponent;
  let fixture: ComponentFixture<DeliveryDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
