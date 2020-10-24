import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.scss']
})
export class CourierComponent implements OnInit, OnDestroy {
  public isWeb3Initialized = false;
  public isCheckingConnexion = true;
  private subscription = new Subscription();

  constructor(private web3Service: Web3Service) {
    this.listenToWeb3Initialized();
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onLinkWallet(): void {
    this.web3Service.openLinkWalletDialog();
  }

  private listenToWeb3Initialized(): void {
    const subscription = this.web3Service.isWeb3Initialized$.pipe(
      ).subscribe(
      isWeb3Initialized => {
        this.isWeb3Initialized = isWeb3Initialized;
        this.isCheckingConnexion = false;
      },
      err => console.log(err)
    );
    this.subscription.add(subscription);
  }

}
