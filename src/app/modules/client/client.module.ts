import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './components/client/client.component';
import { ClientRoutingModule } from './client-routing.modules';
import { SharedModule } from '../shared/shared.module';
import { DeliveryCreationComponent } from './components/client/delivery-creation/delivery-creation.component';



@NgModule({
  declarations: [ClientComponent, DeliveryCreationComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
