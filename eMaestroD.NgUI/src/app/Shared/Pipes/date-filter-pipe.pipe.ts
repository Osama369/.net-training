import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {
  transform(items: any[], days: number): any[] {
    const currentDate = new Date();
    const last30DaysDate = new Date();
    last30DaysDate.setDate(currentDate.getDate() - days);

    return items.filter(item => new Date(item.createdDate) >= last30DaysDate);
  }
}
