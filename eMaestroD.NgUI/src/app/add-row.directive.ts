import { Directive, Input, HostListener } from '@angular/core';
import { Table } from 'primeng/table';

@Directive({
  selector: '[pAddRow]'
})
export class AddRowDirective {
  @Input() table: Table;
  @Input() newRow: any;
  toastr: any;

  @HostListener('click', ['$event'])
  onClick(event: Event) {

    if(this.table.value[this.table.value.length - 1].prodID != undefined
      && this.table.value[this.table.value.length - 1].qty != undefined
      && this.table.value[this.table.value.length - 1].qty != 0){
      // Insert a new row
      this.table.value.push(this.newRow);

      // Set the new row in edit mode
      this.table.initRowEdit(this.newRow);
      event.preventDefault();
    }
    else
    {
      //this.toastr.error("Please insert Data in this row first", '');
    }
  }
}
