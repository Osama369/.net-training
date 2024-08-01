import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CoaService } from 'src/app/Administration/Services/coa.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { CreditCardService } from '../../Services/credit-card.service';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {
  cols:any []= [];
  exportData:any []= [];
  creditCardList: any[] = [];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  cardlist : any[];
  title :any;
  grouptitle :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  cardVisible: boolean = false;

  constructor(
      private coaService: CoaService,
      private creditCardService: CreditCardService,
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.creditCardService.GetAllCreditCard().subscribe(card => {
      this.creditCardList = (card as { [key: string]: any })["enttityDataSource"];
      this.cols = (card as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('CreditCardCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Credit Card Registration";
          this.cardlist = [];
          this.cardVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('CreditCardEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Credit Card Edit";
          this.cardlist = data.value;
          this.cardVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('CreditCardDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.cardID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    else if(data.type == 'groupAdded')
    {
      console.log(data.value)
        this.creditCardList.push(data.value);
      console.log(this.creditCardList)

        this.cardVisible = false;
    }
    else if(data.type=='isDefault')
    {
      this.authService.checkPermission('CreditCardEdit').subscribe(x=>{
        if(x)
        {
          if(data.value.isDefault == true)
          {
            this.creditCardService.UpdateIsDefault(data.value).subscribe({
              next: (lst)=> {
                this.creditCardList = lst;
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
        this.cardVisible = false;
    }

}

deleteView(id:any)
{
    if (confirm("Are you sure you want to delete this CreditCard?") == true) {
        this.loading = true;
       this.creditCardService.DeleteCreditCard(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Credit card has been successfully deleted!");
          this.creditCardList = this.creditCardList.filter(item => item.cardID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
