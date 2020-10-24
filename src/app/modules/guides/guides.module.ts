import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './components/faq/faq.component';
import { GuidesRoutingModule } from './guides-routing.module';



@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule
  ]
})
export class GuidesModule { }
