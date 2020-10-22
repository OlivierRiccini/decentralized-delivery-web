import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCreationComponent } from './delivery-creation.component';

describe('DeliveryCreationComponent', () => {
  let component: DeliveryCreationComponent;
  let fixture: ComponentFixture<DeliveryCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
