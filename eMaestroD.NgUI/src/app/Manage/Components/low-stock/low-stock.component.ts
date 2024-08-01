import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ProductsService } from '../../Services/products.service';


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

