import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourierComponent } from './components/courier/courier.component';

const routes: Routes = [
  { path: '', component: CourierComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierRoutingModule { }
