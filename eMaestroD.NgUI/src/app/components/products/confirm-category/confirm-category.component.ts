import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/models/customer';
import { InvoiceView } from 'src/app/models/invoice-view';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { GenericService } from 'src/app/services/generic.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { Products } from 'src/app/models/products';
import { AuthService } from 'src/app/services/auth.service';
import { data } from 'jquery';

@Component({
  selector: 'app-confirm-category',
  templateUrl: './confirm-category.component.html',
  styleUrls: ['./confirm-category.component.scss']
})

export class ConfirmCategoryComponent implements OnInit {

    @Input() Data : any[] = [];
    ProductCategorylist : any[] = [];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    selectedProducts: any[] = [];
    purchaseOrderVisibiliy : boolean = false;
    @Output() dataEvent = new EventEmitter<any>();


    constructor(private productsService: ProductsService,
      private toastr: ToastrService, private router: Router,
      private authService: AuthService) { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void{
      if(this.Data != undefined && this.Data.length > 0)
      {
          this.ProductCategorylist = this.Data;
      }
      else
      {
        this.ProductCategorylist = [];
      }
    }

    sendDataToParent(bool:any) {
      this.dataEvent.emit({type:'',value:bool});
    }
}

