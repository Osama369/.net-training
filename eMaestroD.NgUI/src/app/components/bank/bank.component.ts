import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { COA } from 'src/app/models/COA';
import { prodGroups } from 'src/app/models/prodGroups';
import { Products } from 'src/app/models/products';
import { AuthService } from 'src/app/services/auth.service';
import { BankService } from 'src/app/services/bank.service';
import { CoaService } from 'src/app/services/coa.service';
import { GenericService } from 'src/app/services/generic.service';
import { ProductCategoryService } from 'src/app/services/product-category.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent {
  cols:any []= [];
  exportData:any []= [];
  bankName: any[] = [];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  Banklist : any[];
  title :any;
  grouptitle :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  BankVisible: boolean = false;

  constructor(
      private coaService: CoaService,
      private bankService: BankService,
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.bankService.GetAllBanks().subscribe(banks => {
      this.bankName = (banks as { [key: string]: any })["enttityDataSource"];
      this.cols = (banks as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('BankCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Bank Registration";
          this.Banklist = [];
          this.BankVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('BankEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Bank Edit";
          this.Banklist = data.value;
          this.BankVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('BankDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.bankID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    else if(data.type == 'groupAdded')
    {
        this.bankName.push(data.value);
        this.BankVisible = false;
    }
    else if(data.type=='isDefault')
    {
      console.log(data);
      this.authService.checkPermission('BankEdit').subscribe(x=>{
        if(x)
        {
          if(data.value.isDefault == true)
          {
            this.bankService.UpdateIsDefault(data.value).subscribe({
              next: (lst)=> {
                this.bankName = lst;
              },
            })
          }
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else
    {
        this.BankVisible = false;
    }

}

deleteView(id:any)
{
    if (confirm("Are you sure you want to delete this Bank?") == true) {
        this.loading = true;
       this.bankService.DeleteBank(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Bank has been successfully deleted!");
          this.bankName = this.bankName.filter(item => item.bankID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
