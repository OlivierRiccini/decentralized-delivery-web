import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'deliveryState'})
export class DeliveryState implements PipeTransform {
  transform(code: number): string {
    return ['unknown', 'pending', 'awaiting pickup', 'started', 'ended', 'ended by sender'][code];
  }
}
