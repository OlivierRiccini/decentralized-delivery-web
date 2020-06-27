import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Web3 from 'web3';
import { IAccount } from '../models/account';
import * as moment from 'moment';

declare let require: any;
const DELIVERY_MANAGER_ARTIFACTS = require('../../config/contracts/DeliveryManager.json');

declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  public ready = false;
  private account: BehaviorSubject<IAccount>;
  public account$: Observable<IAccount>;
  private network: BehaviorSubject<string>;
  public network$: Observable<string>;
  private deliveryStream: BehaviorSubject<any>;
  public deliveryStream$: Observable<any>;
  private isWeb3Ready: BehaviorSubject<boolean>;
  public isWeb3Ready$: Observable<boolean>;
  private contractAddress: string;

  private deliveryManagerContract: any;

  constructor() {
    this.account = new BehaviorSubject(null);
    this.account$ = this.account.asObservable();
    this.deliveryStream = new BehaviorSubject(null);
    this.deliveryStream$ = this.deliveryStream.asObservable();
    this.network = new BehaviorSubject(null);
    this.network$ = this.network.asObservable();
    this.isWeb3Ready = new BehaviorSubject(false);
    this.isWeb3Ready$ = this.isWeb3Ready.asObservable();
    this.contractAddress = '0x278Bb1675c63A1922429EfE86a59773e0532454D';
    this.initWeb3();
  }

  public async loadDeliveries(): Promise<any> {
    try {
      const count = await this.deliveryManagerContract.methods.getDeliveryCount().call();
      const deliveries = [];
      for (let i = 0; i < count; i++) {
        const deliveryHash = await this.deliveryManagerContract.methods.getDeliveryHash(i).call();
        const delivery = await this.deliveryManagerContract.methods.getDelivery(deliveryHash).call();
        const decodedDelivery = this.decodeDelivery(delivery, deliveryHash);
        deliveries.push(decodedDelivery);
      }
      return deliveries;
    } catch (err) {
      console.log('MEGA ERROR ', err);
    }
  }

  public async getDeliveryCount(): Promise<number> {
    const count = await this.deliveryManagerContract.methods.getDeliveryCount().call();
    return count;
  }

  public async createDelivery(delivery: any, senderAddress: string): Promise<void> {
    console.log(delivery);
    const encodedDelivery = this.encodeDeliery(delivery);
    console.log(encodedDelivery);
    const res = await this.deliveryManagerContract.methods.createDelivery(
      encodedDelivery.senderName,
      encodedDelivery.senderPhone,
      encodedDelivery.senderEmail,
      encodedDelivery.receiverEthAddress,
      encodedDelivery.receiverName,
      encodedDelivery.receiverPhone,
      encodedDelivery.receiverEmail,
      encodedDelivery.fromAddress,
      encodedDelivery.toAddress,
      encodedDelivery.reward,
      encodedDelivery.cautionAmount,
      encodedDelivery.deadline)
      .send({ from: senderAddress });
      await this.updateAccounts();
      return res;
  }

  public async getDelivery(deliveryHash: string): Promise<any> {
    const delivery = await this.deliveryManagerContract.methods.getDelivery(deliveryHash).call();
    const decodedDelivery = this.decodeDelivery(delivery, deliveryHash);
    return decodedDelivery;
  }

  public async applyToDelivery(deliveryHash: string, cautionAmount: number): Promise<void> {
    const applicantName = this.web3.utils.asciiToHex('Test Name');
    const applicantPhone = this.web3.utils.asciiToHex('4383991333');
    const applicantEmail = this.web3.utils.asciiToHex('info@testname.com');
    const value = this.web3.utils.toWei(cautionAmount.toString(), 'ether');
    const accounts = await this.web3.eth.getAccounts();
    const from = accounts[0];
    await this.deliveryManagerContract.methods.applyToDelivery(
      deliveryHash,
      applicantName,
      applicantPhone,
      applicantEmail
    ).send({from, value});
  }

  public async startDelivery(deliveryHash: string, reward: number): Promise<void> {
    const value = this.web3.utils.toWei(reward.toString(), 'ether');
    const accounts = await this.web3.eth.getAccounts();
    const from = accounts[0];
    await this.deliveryManagerContract.methods.startDelivery(deliveryHash).send({from, value});
  }

  public async signReceip(deliveryHash: string): Promise<void> {
    const accounts = await this.web3.eth.getAccounts();
    const from = accounts[0];
    const res = await this.deliveryManagerContract.methods.signReceip(deliveryHash).send({from});
    console.log(res);
  }

  public async cancelDelivery(deliveryHash: string): Promise<void> {
    const accounts = await this.web3.eth.getAccounts();
    const from = accounts[0];
    const res = await this.deliveryManagerContract.methods.triggerIsOverTime(deliveryHash).send({from});
    console.log(res);
  }

  public async getUser(): Promise<any> {
    const accounts = await this.web3.eth.getAccounts();
    const userEthAddress = accounts[0];
    const user = await this.deliveryManagerContract.methods.getUser(userEthAddress).call();
    const decodedUser = this.decodeUser(user, userEthAddress);
    return decodedUser;
  }

  private initWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.ethereum.enable().then(async () => {
        this.web3 = new Web3(window.ethereum);
        // const accounts = await this.web3.eth.getAccounts();
        await this.updateAccounts();
        await this.listenToAccountsChanged();
        await this.getCurrentNetwork();
        this.initContractInstance();
        this.initEventSubscriptions();
        this.isWeb3Ready.next(true);
      });
    } else {
      alert('No web3? You should consider trying MetaMask!');
      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
  }

  private async listenToAccountsChanged(): Promise<void> {
    window.ethereum.on('accountsChanged', async () => {
      await this.updateAccounts();
    });
  }

  private async updateAccounts(): Promise<void> {
    const accounts = await this.web3.eth.getAccounts();
    const address = accounts[0];
    let balance = await this.web3.eth.getBalance(accounts[0]);
    balance = this.web3.utils.fromWei(balance, 'ether');
    this.account.next({address, balance});
  }

  private async getCurrentNetwork(): Promise<void> {
    const network = await this.web3.eth.net.getNetworkType();
    this.network.next(network);
  }

  private initContractInstance(): void {
    this.deliveryManagerContract = new this.web3.eth.Contract(DELIVERY_MANAGER_ARTIFACTS.abi, this.contractAddress);
  }

  private initEventSubscriptions(): void {
    this.deliveryManagerContract.events.allEvents({ fromBlock: 'latest' }, async (error, event) => {
      if (event.returnValues._deliveryHash) {
        const deliveryHash = event.returnValues._deliveryHash;
        const delivery = await this.getDelivery(deliveryHash);
        this.deliveryStream.next(delivery);
      }
    });
  }

  private decodeDelivery(delivery: any, hash: string) {
    return {
      hash,
      cautionAmount: this.web3.utils.fromWei(delivery.cautionAmount.toString(), 'ether'),
      courier: delivery.courier,
      deadline: new Date(0).setUTCSeconds(+delivery.deadline),
      endTime: new Date(0).setUTCSeconds(+delivery.endTime),
      fromAddress: this.web3.utils.toUtf8(delivery.fromAddress),
      receiver: delivery.receiver,
      reward: this.web3.utils.fromWei(delivery.reward.toString(), 'ether'),
      sender: delivery.sender,
      startTime: new Date(0).setUTCSeconds(+delivery.startTime),
      state: +delivery.state,
      timestamp: new Date(0).setUTCSeconds(+delivery.timestamp),
      toAddress: this.web3.utils.toUtf8(delivery.toAddress)
    };
  }

  private decodeUser(user: any, userEthAddress: string): any {
    return {
      ethAddress: userEthAddress,
      name: this.web3.utils.toUtf8(user.name),
      phone: this.web3.utils.toUtf8(user.phone),
      email: this.web3.utils.toUtf8(user.email)
    };
  }

  private encodeDeliery(delivery: any): any {
    return {
      senderName: this.web3.utils.asciiToHex(delivery.senderName),
      senderPhone: this.web3.utils.asciiToHex(delivery.senderPhone),
      senderEmail: this.web3.utils.asciiToHex(delivery.senderEmail),
      receiverEthAddress: delivery.receiverEthAddress,
      receiverName: this.web3.utils.asciiToHex(delivery.receiverName),
      receiverPhone: this.web3.utils.asciiToHex(delivery.receiverPhone),
      receiverEmail: this.web3.utils.asciiToHex(delivery.receiverEmail),
      fromAddress: this.web3.utils.asciiToHex(delivery.fromAddress),
      toAddress: this.web3.utils.asciiToHex(delivery.toAddress),
      reward: this.web3.utils.toWei(delivery.reward.toString(), 'ether'),
      cautionAmount: this.web3.utils.toWei(delivery.cautionAmount.toString(), 'ether'),
      deadline: moment(new Date(delivery.deadline)).unix()
    };
  }

}
