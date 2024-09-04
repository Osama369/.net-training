import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { OfferService } from '../../Services/offer.service';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent {
  cols:any []= [];
  exportData:any []= [];
  data: any[] = [];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  dataList : any[];
  title :any;
  grouptitle :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  DailogVisible: boolean = false;

  constructor(
      private offerService: OfferService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.offerService.getOffers().subscribe(result => {
      this.data = (result as { [key: string]: any })["enttityDataSource"];
      this.cols = (result as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('OfferCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Offer Registration";
          this.dataList = [];
          this.DailogVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('OfferEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Offer Edit";
          this.dataList = data.value;
          this.DailogVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('OfferDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.offerID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'added')
    {
        this.data.push(data.value);
        this.DailogVisible = false;
    }
    else
    {
        this.DailogVisible = false;
    }

}

deleteView(id:any)
{
    if (confirm("Are you sure you want to delete this Offer?") == true) {
        this.loading = true;
       this.offerService.deleteOffer(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Offer has been successfully deleted!");
          this.data = this.data.filter(item => item.offerID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
