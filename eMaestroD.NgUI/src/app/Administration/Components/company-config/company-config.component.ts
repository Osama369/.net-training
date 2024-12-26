import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { Currency } from '../../Models/currency';
import { lastValueFrom } from 'rxjs';
import { TimezoneDatePipe } from 'src/app/Shared/Pipes/timezone-date.pipe';
import { Companies } from '../../Models/companies';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-company-config',
  templateUrl: './company-config.component.html',
  styleUrls: ['./company-config.component.scss']
})
export class CompanyConfigComponent implements OnInit {
 @Output() showNextEvent= new EventEmitter<number>();
 @ViewChild('file') fileUpload: any;
  CurrencyList:Currency[]=[];
  filterCurrencyList : any[] = [];
  SelectedCurrency :any;
  filterTimeZoneList : any[] = [];
  TimeZoneList : any[] = [];
  SelectedTimeZone :any;
  isDisplay =false;
  // fileUpload: any;
  configurationList : Companies[] = [];
  editable : boolean = false;

  constructor(private genericService : GenericService ,
              private toastr: ToastrService,
  ){}
  async ngOnInit() {
    this.getDetail();
    const currResult =await lastValueFrom(this.genericService.getAllCurrency());
    this.CurrencyList = currResult;
    const  timeZoneResult = await lastValueFrom(this.genericService.GetTimeZone());
    this.TimeZoneList = timeZoneResult;
    console.log("currencyList:",this.CurrencyList);
    console.log('timeZone',this.TimeZoneList);
  }


  filterCurrency(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    console.log('y');
    let filtered: any[] = [];
    let query = event.query.toLowerCase(); // Convert query to lowercase for case-insensitive matching
    for (let i = 0; i < this.CurrencyList.length; i++) {
        let currency = this.CurrencyList[i];
        if (currency.Name.toLowerCase().includes(query)) { // Check if the query string is anywhere within the currency name
            filtered.push(currency);
        }
    }
    this.filterCurrencyList = filtered;
}
filterTimeZone(event: any) {
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  let filtered: any[] = [];
  let query = event.query.toLowerCase(); // Convert query to lowercase for case-insensitive matching
  for (let i = 0; i < this.TimeZoneList.length; i++) {
      let tz = this.TimeZoneList[i];
      if (tz.timeZone.toLowerCase().includes(query)) { // Check if the query string is anywhere within the time zone
          filtered.push(tz);
      }
  }
  this.filterTimeZoneList = filtered;
}
TaxValidation(event: Event) {
  const input = event.target as HTMLInputElement;

  // Prevent user from entering invalid (non-numeric) characters
  const currentValue = input.value;

  // Check if the value contains only valid numbers or a single decimal point
  const validValue = currentValue.match(/^\d*\.?\d*$/) ? currentValue : currentValue.replace(/[^0-9.]/g, '');
console.log("validValue",validValue);
  // Update the input field value
  input.value = validValue;
}
Save(){
   
}
saveCompanyDetail()
{
  // this.authService.checkPermission('CompanySettingEdit').subscribe(x=>{
  //   if(x)
    // {
        const formData = new FormData();
        formData.append('file', this.fileUpload.files[0]);

        if(this.configurationList[0].companyName == "" || this.configurationList[0].companyName == undefined
          && this.SelectedCurrency.Name == "" || this.SelectedCurrency.Name == undefined)
        {this.toastr.error("Please fill the empty blanks!");}
        else{
          this.configurationList[0].CurrencyCode = this.SelectedCurrency.CurrencyCode;
          
          this.configurationList[0].timeZoneID = this.SelectedTimeZone == undefined ? null : this.SelectedTimeZone.timeZoneID;
          this.configurationList[0].isConfigured =1;
          this.genericService.saveConfiguration(this.configurationList[0]).subscribe({
            next: (Gl) => {
                this.getDetail();
                this.editable = false;
                this.toastr.success("Company Setting has been succesfully updated!");
                this.showNextEvent.emit(2);
                this.isDisplay =true;
            },
          });

          if(this.fileUpload.files[0] != undefined){

            this.genericService.saveFile(formData).subscribe({
              next: (imgUrl) => {
                window.location.reload();
                },
                error:(err:any)=>{
                  window.location.reload();
                }
              });
              this.fileUpload.clear();
            }
        // }
    }
    // else{
    //   this.toastr.error("Unauthorized Access! You don't have permission to access.");
    // }
  // });

}
createNewConfiguration()
{
  return{
    ConfigurationID:undefined,
    companyName:undefined,
    address:undefined,
    productionType:undefined,
    contactNo:undefined,
    CurrencyCode:undefined,
    logoFile:undefined,
  }
}
getDetail()
{
   this.configurationList.push(this.createNewConfiguration());
    this.genericService.getConfiguration().subscribe(asd => {
    this.configurationList = asd;
    this.configurationList.unshift(asd[0]);
    this.configurationList.splice(1,1);
    this.SelectedCurrency= {Name:this.configurationList[0].CurrencyName,CurrencyCode:this.configurationList[0].CurrencyCode};
    localStorage.setItem("timeZone",this.configurationList[0].timeZone);

    this.genericService.GetTimeZone().subscribe(asd => {
      this.TimeZoneList = asd;
      this.filterTimeZoneList = this.TimeZoneList;
      if(this.configurationList[0].timeZoneID != null)
      {
        this.SelectedTimeZone = {timeZoneID:this.configurationList[0].timeZoneID,timeZone:this.TimeZoneList.find(x=>x.timeZoneID == this.configurationList[0].timeZoneID).timeZone};
      }
      let list = this.TimeZoneList.find(x=>x.timeZoneID == this.configurationList[0].timeZoneID);
    });

  });
  // this.genericService.getAllCurrency().subscribe(asd => {
  //   this.CurrencyList = asd;
  // });

 

}


}

