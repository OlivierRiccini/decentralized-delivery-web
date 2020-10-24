import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMetamaskComponent } from './link-metamask.component';

describe('LinkMetamaskComponent', () => {
  let component: LinkMetamaskComponent;
  let fixture: ComponentFixture<LinkMetamaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkMetamaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkMetamaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
