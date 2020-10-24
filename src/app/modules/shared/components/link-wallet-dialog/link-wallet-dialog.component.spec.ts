import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWalletDialogComponent } from './link-wallet-dialog.component';

describe('LinkWalletDialogComponent', () => {
  let component: LinkWalletDialogComponent;
  let fixture: ComponentFixture<LinkWalletDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkWalletDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
