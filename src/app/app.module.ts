import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { Web3Service } from './services/web3.service';
import { SharedModule } from './components/shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DeliveryListComponent } from './components/home/delivery-list/delivery-list.component';
import { DeliveryCreationComponent } from './components/home/delivery-creation/delivery-creation.component';
import { DeliveryDetailsDialogComponent } from './components/delivery-details-dialog/delivery-details-dialog.component';
import { DeliveryState } from './pipes/deliveryState.pipe';
import { DeliveryStateIcon } from './pipes/deliveryStateIcon.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DeliveryListComponent,
    DeliveryCreationComponent,
    DeliveryDetailsDialogComponent,
    DeliveryState,
    DeliveryStateIcon,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
