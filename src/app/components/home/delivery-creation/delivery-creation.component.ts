import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Web3Service } from 'src/app/services/web3.service';
import { IAccount } from 'src/app/models/account';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-delivery-creation',
  templateUrl: './delivery-creation.component.html',
  styleUrls: ['./delivery-creation.component.scss']
})
export class DeliveryCreationComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  public currentAccount: IAccount;
  public creationForm: FormGroup;
  public submitted = false;
  public isSending = false;
  public selectedIndex: number;
  private subscription = new Subscription();

  constructor(
    private zone: NgZone,
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private notificationService: NotificationService,
    protected formDirective: FormGroupDirective
    ) {
    this.web3Service.isWeb3Ready$.subscribe(isReady => {
      if (isReady) {
        this.listenToAccountChanges();
      }
    });
  }

  public ngOnInit(): void {
    const senderInfo = this.formBuilder.group({
      senderName: ['', Validators.required],
      senderPhone: ['', Validators.required],
      senderEmail: ['', Validators.required]
    });

    const receiverInfo = this.formBuilder.group({
      receiverEthAddress: ['', [Validators.required]],
      receiverName: ['', [Validators.required]],
      receiverPhone: ['', Validators.required],
      receiverEmail: ['', [Validators.required]]
    });

    const deliveryInfo = this.formBuilder.group({
      fromAddress: ['', [Validators.required]],
      toAddress: ['', Validators.required],
      reward: ['', [Validators.required]],
      cautionAmount: ['', [Validators.required]],
      deadline: ['', Validators.required],
    });

    this.creationForm = this.formBuilder.group({
      senderInfo,
      receiverInfo,
      deliveryInfo,
    });
  }

  public onSubmit(formDirective) {
    this.isSending = true;
    if (this.creationForm.value.senderInfo.senderName === 'mock') {
      let mockDelivery = {
        deliveryInfo: {
          cautionAmount: 0.2,
          deadline: '2020-06-18',
          fromAddress: '123 main street',
          reward: 0.2,
          toAddress: '234 main street'
        },
        receiverInfo: {
          receiverEmail: 'roger@test.com',
          receiverEthAddress: '0x9C737830b5dF10BcbDc107FB68185b4274F6B538',
          receiverName: 'Roger',
          receiverPhone: '4383991332'
        },
        senderInfo: {
          senderEmail: 'info@olivierriccini.com',
          senderName: 'Inho',
          senderPhone: '0674990099'
        }
      };
      mockDelivery = this.formatFormDelivery(mockDelivery);
      this.web3Service.createDelivery(mockDelivery, this.currentAccount.address)
        .then(res => {
          this.notificationService.sendSuccess('Delivery created successfully!');
          this.stepper.reset();
        })
        .catch(err => this.notificationService.sendError('Something went wrong while creating delivery'))
        .finally(() => this.isSending = false);
    } else {
      if (this.creationForm.invalid) {
        return;
      }
      console.log(this.creationForm.value);
      const fomattedDelivery = this.formatFormDelivery(this.creationForm.value);
      this.web3Service.createDelivery(fomattedDelivery, this.currentAccount.address)
        .then(res => {
          this.notificationService.sendSuccess('Delivery successfully created!');
          this.stepper.reset();
        })
        .catch(err => this.notificationService.sendError('Something went wrong while creating delivery'))
        .finally(() => this.isSending = false);
    }
    this.resetForm(formDirective);
  }

  private resetForm(formDirective: FormGroupDirective) {
    this.creationForm.reset();
    formDirective.resetForm();
  }

  private formatFormDelivery(delivery: any): any {
    return {
        cautionAmount: delivery.deliveryInfo.cautionAmount,
        deadline: delivery.deliveryInfo.deadline,
        fromAddress: delivery.deliveryInfo.fromAddress,
        reward: delivery.deliveryInfo.reward,
        toAddress: delivery.deliveryInfo.toAddress,
        receiverEmail: delivery.receiverInfo.receiverEmail,
        receiverEthAddress: delivery.receiverInfo.receiverEthAddress,
        receiverName: delivery.receiverInfo.receiverName,
        receiverPhone: delivery.receiverInfo.receiverPhone,
        senderEmail: delivery.senderInfo.senderEmail,
        senderName:  delivery.senderInfo.senderName,
        senderPhone:  delivery.senderInfo.senderPhone
    };
  }

  public selectionChange(e) {
    this.selectedIndex = e.selectedIndex;
  }

  private listenToAccountChanges(): void {
    const subscription = this.web3Service.account$.subscribe(account => {
      this.zone.run(() => {
        this.currentAccount = account;
      });
    });
    this.subscription.add(subscription);
  }

}
