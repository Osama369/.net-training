import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';


@Component({
  selector: 'app-add-new-customer-for-invoice',
  templateUrl: './add-new-customer-for-invoice.component.html',
  styleUrls: ['./add-new-customer-for-invoice.component.scss']
})
export class AddNewCustomerForInvoiceComponent {
  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private customersService:CustomersService,
    private toastr: ToastrService,
    private el: ElementRef,
  ) {}

  customerList: Customer[];

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() cstData : any;
  @Input() title : any;
  @Input() type : any;

  isSave : boolean = true;
  isRegular : boolean = true;
  isDisable : boolean = true;

  allLocation:any;
  regionList : any;
  cityList : any;
  areaList : any;
  selectedRegion:any;
  selectedCity:any;
  selectedArea:any;

  sendDataToParent() {
    this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ChangeRegion(){
    this.cityList = this.allLocation.filter(x=>x.LocTypeId == 4 && x.ParentLocationId == this.selectedRegion);
  }

  ChangeCity(){
    this.areaList = this.allLocation.filter(x=>x.LocTypeId == 5 && x.ParentLocationId == this.selectedCity);
  }

  ngOnInit(): void {
    this.customerList = [
      {
        cstID : undefined,
        regionID : undefined,
        regionName : undefined,
        cityID : undefined,
        cityName : undefined,
        areasID : undefined,
        areasName : undefined,
        cstCode : undefined,
        cstName : undefined,
        cstShortName : undefined,
        isLicence : true,
        city : undefined,
        state : undefined,
        active : true,
        crtBy : undefined,
        crtDate : undefined,
        modby : undefined,
        modDate : undefined,
        taxNo : undefined,
        taxValue : undefined,
        address:undefined,
        contPhone:undefined,
        comment : undefined,
        comID:undefined,
        opnBal:undefined,
        message:undefined
      }
    ]

    this.customersService.GetCstCode().subscribe(nmb=>{
      this.customerList[0].cstCode = nmb;
    });

    this.sharedDataService.getLocations$().subscribe(loc=>{
      this.allLocation = loc;
      this.regionList = loc.filter(x=>x.LocTypeId == 3);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
      this.isRegular = true;
      if(this.type == "Credit"){
        this.isDisable = false;
      }else{
        this.isDisable = true;
      }
      this.clear();
  }


OnRadioChange(isRegular: boolean) {
  this.clear();
  this.isRegular = isRegular;
}

CheckCustomerExistByPhone()
{
  if(this.isRegular && this.customerList[0].contPhone == "" || this.customerList[0].contPhone.replace(/[^0-9]/g, '').length < 12 || this.customerList[0].contPhone == undefined)
  {

  }else{
    this.customersService.GetCustomerByPhoneNo(this.customerList[0].contPhone).subscribe({
      next: result=>{
        this.customerList[0] = result;
      }
    });
  }
}

CheckCustomerExistByVAT()
{
  if(this.isRegular && this.customerList[0].taxNo == "" || this.customerList[0].taxNo == undefined)
  {

  }else{
    this.customersService.GetCustomerByPhoneNo(this.customerList[0].taxNo).subscribe({
      next: result=>{
        this.customerList[0] = result;
      }
    });
  }
}

  clear()
  {
    this.selectedRegion = null;
    this.selectedCity = null;
    this.selectedArea = null;

    this.customerList = [
      {
        cstID : undefined,
        regionID : undefined,
        regionName : undefined,
        cityID : undefined,
        cityName : undefined,
        areasID : undefined,
        areasName : undefined,
        cstCode : undefined,
        cstName : undefined,
        cstShortName : undefined,
        isLicence : true,
        city : undefined,
        state : undefined,
        active : true,
        crtBy : undefined,
        crtDate : undefined,
        modby : undefined,
        modDate : undefined,
        taxNo : undefined,
        taxValue : undefined,
        address:undefined,
        contPhone:undefined,
        comment : undefined,
        comID:undefined,
        opnBal:undefined,
        message:undefined
      }
    ];

    this.customersService.GetCstCode().subscribe(nmb=>{
      this.customerList[0].cstCode = nmb;
    });
  }

  saveCustomer()
  {

    if(this.isRegular && (this.customerList[0].cstCode == "" || this.customerList[0].cstCode == undefined))
    {
      this.toastr.error("Please write customer code");
      this.onEnterTableInputCst(-1);
    }
    else if(this.customerList[0].cstName == "" || this.customerList[0].cstName == undefined)
    {
      this.toastr.error("Please write customer name");
        this.onEnterTableInputCst(0);
    }else if(this.isRegular && this.selectedArea == undefined){
      this.toastr.error("Please select area");
      this.onEnterTableInputCst(0);
    }
    else if(this.isRegular){
      this.customerList[0].cityID = this.selectedArea.LocationId;
      this.customerList[0].city = this.selectedArea.LocationName;
      this.customerList[0].active = true;
      this.customerList[0].comID = localStorage.getItem("comID");
      this.customerList[0].comment = this.isRegular;
      this.customersService.saveCustomer(this.customerList[0]).subscribe({
        next: (cst:any) => {

          this.clear();
          if(this.title == "Customer Registration")
          {
            this.toastr.success("Customer has been successfully added!");
            this.dataEvent.emit({type:'added',value:cst});
          }
          else
          {
            this.toastr.success("Customer has been successfully updated! "+cst.message);
            this.dataEvent.emit({type:'',value:cst});
          }
        },
        error: (response) => {
          this.toastr.error(response.error);
          this.onEnterTableInputCst(-1);
        },
      });
    }
    else{
      this.customerList[0].active = true;
      this.customerList[0].comID = localStorage.getItem("comID");
      this.customerList[0].comment = this.isRegular;
      this.customersService.saveCustomer(this.customerList[0]).subscribe({
        next: (cst:any) => {
          this.clear();
          if(this.title == "Customer Registration")
          {
            this.toastr.success("Customer has been succesfully added!");
            this.dataEvent.emit({type:'addedWalkin',value:cst});
          }
        },
        error: (response) => {
          this.toastr.error(response.error);
          this.onEnterTableInputCst(-1);
        },
      });
    }

  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }
}
