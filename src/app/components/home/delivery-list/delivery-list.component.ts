import { Component, ViewChild, NgZone } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Web3Service } from 'src/app/services/web3.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryDetailsDialogComponent } from '../../delivery-details-dialog/delivery-details-dialog.component';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent {
  public displayedColumns: string[] = ['timestamp', 'state', 'reward', 'cautionAmount', 'detailsBtn'];
  private deliveries: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private zone: NgZone, public dialog: MatDialog, private web3Serice: Web3Service) {
    this.web3Serice.loadDeliveries().then(deliveries => {
      this.deliveries = _.orderBy(deliveries, ['timestamp'], ['desc']);
      this.dataSource = new MatTableDataSource(this.deliveries);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }).finally(() => this.areDataLoaded = true);

    this.web3Serice.deliveryStream$.subscribe(delivery => {
      console.log(delivery);
      this.zone.run(() => {
        if (delivery) {
          const deliveryIndex = _.findIndex(this.deliveries, {hash: delivery.hash});
          if (deliveryIndex !== -1) {
            this.deliveries.splice(deliveryIndex, 1, delivery);
          } else {
            this.deliveries.unshift(delivery);
          }
          this.dataSource.data = this.deliveries;
        }
      });
    });
  }

  public openDialog(develiveryHash: string) {
    this.web3Serice.getDelivery(develiveryHash).then(delivery => {
      this.dialog.open(DeliveryDetailsDialogComponent, {
        data: delivery
      });
    });
  }

}
