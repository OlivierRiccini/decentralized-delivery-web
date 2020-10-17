import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MapComponent } from './components/map/map.component';
import { DeliveryListComponent } from './components/delivery-list/delivery-list.component';
import { DeliveryDetailsDialogComponent } from './components/delivery-details-dialog/delivery-details-dialog.component';
import { DeliveryStateIcon } from 'src/app/pipes/deliveryStateIcon.pipe';
import { DeliveryState } from 'src/app/pipes/deliveryState.pipe';

@NgModule({
  declarations: [
    MapComponent,
    DeliveryListComponent,
    DeliveryDetailsDialogComponent,
    DeliveryStateIcon,
    DeliveryState
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule,
    MatTabsModule,
    MatListModule,
    MatSnackBarModule,
    MatMenuModule,
    MapComponent,
    DeliveryListComponent,
    DeliveryDetailsDialogComponent,
    DeliveryStateIcon,
    DeliveryState
  ],
  providers: [
    FormGroupDirective
  ]
})

export class SharedModule { }
