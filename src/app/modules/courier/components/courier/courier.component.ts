import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.scss']
})
export class CourierComponent implements OnInit {
  public isWeb3Initialized$: Observable<boolean>;

  constructor(private web3Service: Web3Service) {
    this.isWeb3Initialized$ = this.web3Service.isWeb3Initialized$;
  }

  ngOnInit(): void {
  }

  public onLinkWallet(): void {
    this.web3Service.linkWallet().then().catch();
  }

}
