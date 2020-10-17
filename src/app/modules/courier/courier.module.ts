import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourierComponent } from './components/courier/courier.component';
import { CourierRoutingModule } from './courier-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [CourierComponent],
  imports: [
    CommonModule,
    CourierRoutingModule,
    SharedModule
  ]
})
export class CourierModule { }
