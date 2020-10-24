import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { WalletConnectionMethod } from 'src/app/models/walletConnectionMethod';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-link-wallet-dialog',
  templateUrl: './link-wallet-dialog.component.html',
  styleUrls: ['./link-wallet-dialog.component.scss']
})
export class LinkWalletDialogComponent  {
  public walletConnectionMethods = environment.walletConnectionMethods;
  public WalletConnectionMethod = WalletConnectionMethod;
  public selectedMethod = WalletConnectionMethod.MetaMask;
  public isMetaMaskInstalled: boolean;

  constructor(public dialogRef: MatDialogRef<LinkWalletDialogComponent>, private web3Service: Web3Service) {
    this.isMetaMaskInstalled = this.web3Service.isMetaMaskInstalled();
  }

 public onTabClick(event: MatTabChangeEvent): void {
  this.selectedMethod = this.walletConnectionMethods[event.index].enumValue;
 }

 public onLinkWallet(): void {
  this.web3Service.linkWallet().then(() => this.dialogRef.close()).catch();
 }

}
