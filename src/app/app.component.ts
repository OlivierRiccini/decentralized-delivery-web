import { Component } from '@angular/core';
import { Web3Service } from './services/web3.service';
// import { IAccount } from './models/account';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isWeb3Ready$: Observable<boolean>;


  constructor(private web3Service: Web3Service) {
    // this.listenToIsWeb3Ready();
    this.isWeb3Ready$ = this.web3Service.isWeb3Initialized$;
  }

  // private listenToIsWeb3Ready(): void {
    // this.web3Service.isWeb3Ready$.subscribe(isReady => this.isWeb3Ready = isReady);
  // }

  // public getDeliveryCount(): void {
  //   this.web3Service.getDeliveryCount(this.currentAccount.address).then(count => {
  //     this.deliveryCount = count;
  //     console.log('INHO LE BIG BOSS DE LA MORT QUI TUE ', count);
  //   });
  // }

  // public createDelivery(): void {
  //   this.web3Service.createDelivery(this.currentAccount.address).then(res => {
  //     console.log('WAHHAHAHAHAH ', res);
  //   });
  // }

  // public getDelivery(): void {
  //   this.web3Service.getDelivery().then(res => {
  //     console.log('DELIVERY MAX ', res);
  //   });
  // }

}
