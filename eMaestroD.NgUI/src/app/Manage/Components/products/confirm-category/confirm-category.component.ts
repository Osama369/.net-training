import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Table } from 'primeng/table';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';

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

