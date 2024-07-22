import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/models/customer';
import { InvoiceView } from 'src/app/models/invoice-view';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { GenericService } from 'src/app/services/generic.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { Products } from 'src/app/models/products';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-low-stock',
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.css']
})

export class LowStockComponent implements OnInit {

    Products : any[];
    ProductList : any[] = [];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    selectedProducts: any[] = [];
    purchaseOrderVisibiliy : boolean = false;
    bookmark : boolean = false;
    constructor(private productsService: ProductsService,
      private toastr: ToastrService, private router: Router,
      private authService: AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

      ngOnInit() {
      this.productsService.getLowStockProducts().subscribe(prd => {
        this.Products = prd;
        this.loading = false;
      });

      this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
        this.bookmark = x;
      });

    }

    UpdateBookmark(value:any){
      this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
        next: (result: any) => {
          this.bookmark = value;
        },
      });;
    }

  CreatePurchaseOrder()
  {

    if(this.selectedProducts.length > 0)
    {
      this.authService.checkPermission('PurchaseOrderCreate').subscribe(x=>{
        if(x)
        {
          this.purchaseOrderVisibiliy = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
      else
      {
        this.toastr.error("Please Select Alteast One Product!");
      }
  }

  handleChildData(data: any) {
    this.purchaseOrderVisibiliy = false;
    this.reLoadList();
  }

  reLoadList()
  {
    this.selectedProducts = [];
    this.productsService.getLowStockProducts().subscribe(prd => {
      this.Products = prd;
      this.loading = false;
    });
  }
}

