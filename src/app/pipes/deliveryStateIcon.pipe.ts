import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'deliveryStateIcon'})
export class DeliveryStateIcon implements PipeTransform {
  transform(code: number): string {
    const icons = {
        0: 'help_outline',
        1: 'pending',
        2: 'hourglass_empty',
        3: 'local_shipping',
        4: 'assignment_turned_in',
        5: 'report_problem'
    };
    return icons[code];
  }
}
