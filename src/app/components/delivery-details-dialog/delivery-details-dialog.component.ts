import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Web3Service } from 'src/app/services/web3.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeliveryState } from 'src/app/models/deliveryState';
import { MatStepper } from '@angular/material/stepper';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-delivery-details-dialog',
  templateUrl: './delivery-details-dialog.component.html',
  styleUrls: ['./delivery-details-dialog.component.scss']
})
export class DeliveryDetailsDialogComponent implements AfterViewInit {
  public isLoading = true;
  public isSending = false;
  public applicationForm: FormGroup;
  public deliveryState = DeliveryState;
  public applicationDisabled: boolean;
  public startDeliveryDisabled: boolean;
  public signReceipDisabled: boolean;
  public startDeliveryTooltipText: string;
  public signReceipTooltipText: string;
  public cancelDeliveryDisabled: boolean;
  public cancelDeliveryDisabledText: string;
  public timer = { days: null, hours: null, minutes: null, seconds: null };
  public deadlineExceeded = false;
  public steps = [];
  private user: any;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    @Inject(MAT_DIALOG_DATA) public deliveryData: any,
    public dialogRef: MatDialogRef<DeliveryDetailsDialogComponent>,
    private formBuilder: FormBuilder,
    private web3Service: Web3Service,
    private notificationService: NotificationService
    ) {
    this.getUser();
    this.initSteps();
    this.initTimer();
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.stepper.selectedIndex = this.deliveryData.state - 1 < this.steps.length ? this.deliveryData.state - 1 : this.steps.length - 1;
      this.steps.forEach((step, index: number) => {
        if (index <= this.stepper.selectedIndex) {
          step.completed = true;
        }
      });
      this.isLoading = false;
    }, 1000);
  }

  public onApplyToDelivery(): void {
    this.isSending = true;
    this.web3Service.applyToDelivery(this.deliveryData.hash, this.deliveryData.cautionAmount)
      .then(async () => {
        this.notificationService.sendSuccess('Congrats, you just applied to this delivery!');
        this.deliveryData = await this.web3Service.getDelivery(this.deliveryData.hash);
      })
      .catch(err => this.notificationService.sendError('Something went wrong during the application'))
      .finally(() => {
        this.isSending = false;
        this.closeDialog();
      });
  }

  public onStartDelivery(): void {
    this.isSending = true;
    this.web3Service.startDelivery(this.deliveryData.hash, this.deliveryData.reward)
      .then(async () => {
        this.notificationService.sendSuccess('Go, delivery has started!');
        this.deliveryData = await this.web3Service.getDelivery(this.deliveryData.hash);
      })
      .catch(err => this.notificationService.sendError('Something went wrong during the application'))
      .finally(() => {
        this.isSending = false;
        this.closeDialog();
      });
  }

  public onSignReceip(): void {
    this.isSending = true;
    this.web3Service.signReceip(this.deliveryData.hash)
      .then(async () => {
        this.notificationService.sendSuccess('Receip successfully signed... Thank you for using this awesome DApp!');
        this.deliveryData = await this.web3Service.getDelivery(this.deliveryData.hash);
      })
      .catch(err => this.notificationService.sendError('Something went wrong while signing the receip'))
      .finally(() => {
        this.isSending = false;
        this.closeDialog();
      });
  }

  public onCancelDelivery(): void {
    this.isSending = true;
    this.web3Service.cancelDelivery(this.deliveryData.hash)
    .then(async () => {
      this.notificationService.sendSuccess('Delivery canceled, you should see your Ethers back in your account...sorry about that...');
      this.deliveryData = await this.web3Service.getDelivery(this.deliveryData.hash);
    })
    .catch(err => this.notificationService.sendError('Something went wrong while canceling delivery'))
    .finally(() => {
      this.isSending = false;
      this.closeDialog();
    });
  }

  private getUser(): void {
    this.isLoading = true;
    this.web3Service.getUser()
      .then(user => {
        this.user = user;
        this.initApplicationForm(user);
        this.setStartDeliveryDisabled(user);
        this.setSignReceipDisabled(user);
        this.setCancelDeliveryDisabled(user);
      })
      .catch(err => this.notificationService.sendError('Something went wrong while fetching user data'));
  }

  private initApplicationForm(user: any): void {
    this.applicationForm = this.formBuilder.group({
      name: [user ? user.name : '', Validators.required],
      phone: [user ? user.phone : '', Validators.required],
      email: [user ? user.email : '', Validators.required]
    });
  }

  private closeDialog(): void {
    this.dialogRef.close();
  }

  private setStartDeliveryDisabled(user: any): void {
    this.startDeliveryDisabled = user.ethAddress !== this.deliveryData.sender;
    if (this.startDeliveryDisabled) {
      this.startDeliveryTooltipText = `Only sender with address ${this.deliveryData.sender} can start this delivery`;
    } else {
      this.startDeliveryTooltipText = `Hi sender, you can start this delivery whenever you want!`;
    }
  }

  private setSignReceipDisabled(user: any): void {
    this.signReceipDisabled = user.ethAddress !== this.deliveryData.receiver;
    if (this.signReceipDisabled) {
      this.signReceipTooltipText = `Only receiver with address ${this.deliveryData.receiver} can sign the delivery receip`;
    } else {
      this.signReceipTooltipText = `Hi receiver, you can sign and enjoy your order!`;
    }
  }

  private setCancelDeliveryDisabled(user: any): void {
    this.cancelDeliveryDisabled = user.ethAddress !== this.deliveryData.sender && !this.deadlineExceeded;
    if (user.ethAddress !== this.deliveryData.sender) {
      this.cancelDeliveryDisabledText = `Only receiver with address ${this.deliveryData.sender} can cancel the delivery`;
    } else if (!this.deadlineExceeded) {
      this.cancelDeliveryDisabledText = `You cannot cancel this delivery until deadline is exceeded`;
    } else {
      this.cancelDeliveryDisabledText = `Hi sender, you can now cancel the delivery and get your money back as well as the caution!`;
    }
  }

  private initSteps(): void {
    for (const state in DeliveryState) {
      if (isNaN(Number(state)) && state !== 'UNKNOWN' && state !== 'ENDED_OVERTIME') {
          this.steps.push({ id: DeliveryState[state], completed: false });
      }
    }
  }

  private initTimer(): void {
    const countDownDate = new Date(this.deliveryData.deadline).getTime();
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      this.timer.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.timer.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.timer.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.timer.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(x);
        this.deadlineExceeded = true;
        this.setCancelDeliveryDisabled(this.user);
      }
    }, 1000);
  }
}
