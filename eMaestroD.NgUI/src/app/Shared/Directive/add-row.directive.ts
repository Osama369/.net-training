import { Directive, Input, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';

@Directive({
  selector: '[pAddRow]'
})
export class AddRowDirective {
  @Input() table: Table;
  @Input() newRow: any;

  constructor(private toastr: ToastrService){}
  isPos : boolean = localStorage.getItem("isPos") === 'true';

  @HostListener('click', ['$event'])
  onClick(event: Event) {

      if(this.table.value[this.table.value.length - 1].prodID != undefined
        && this.table.value[this.table.value.length - 1].qty != undefined
        && this.table.value[this.table.value.length - 1].qty != 0){
        // Insert a new row

        if(this.isPos)
          {

            this.table.value.push(this.newRow);

            // Set the new row in edit mode
            this.table.initRowEdit(this.newRow);
            event.preventDefault();
        }else{
          if(this.table.value[this.table.value.length - 1].batchNo != undefined && this.table.value[this.table.value.length - 1].expiryDate != undefined){

            this.table.value.push(this.newRow);
            this.table.initRowEdit(this.newRow);
            event.preventDefault();
          }else{
             this.toastr.error("Please write batch number and expiry");
          }
        }
      }
      else
      {
        //this.toastr.error("Please insert Data in this row first", '');
      }
  }
}
