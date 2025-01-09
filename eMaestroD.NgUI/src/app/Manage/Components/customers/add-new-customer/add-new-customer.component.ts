import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/Manage/Models/customer';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';


@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrls: ['./add-new-customer.component.css']
})
export class AddNewCustomerComponent {
  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private customersService:CustomersService,
    private vendorService:VendorService,
    private toastr: ToastrService,
    private el: ElementRef,
  ) {}

  customerList: Customer[];
  vendorList: Vendor[];

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() cstData : any;
  @Input() title : any;
  isCstSupp : boolean = false;

  allLocation:any;
  regionList : any;
  cityList : any;
  areaList : any;
  selectedRegion:any;
  selectedCity:any;
  selectedArea:any;
  isSaveDisable : boolean = false;
  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
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

    this.vendorList = [this.createNewVendor()];

    this.customersService.GetCstCode().subscribe(nmb=>{
      this.customerList[0].cstCode = nmb;
    });

    this.sharedDataService.getLocations$().subscribe(loc=>{
      this.allLocation = loc;
      this.regionList = loc.filter(x=>x.LocTypeId == 3);
    });
  }

  ChangeRegion(){
      this.cityList = this.allLocation.filter(x=>x.LocTypeId == 4 && x.ParentLocationId == this.selectedRegion);
    }

  ChangeCity(){
    this.areaList = this.allLocation.filter(x=>x.LocTypeId == 5 && x.ParentLocationId == this.selectedCity);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.cstData != undefined && this.cstData.length != 0)
    {
      if(this.cstData.empID > 0)
      {
        this.isCstSupp = true;
      }else{
        this.isCstSupp = false;
      }
      this.customerList[0] = this.cstData;

      // this.selectedArea = {LocationId : this.customerList[0].cityID, LocationName : this.customerList[0].city};


    }
    else
    {
      this.clear();
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
    ]
    this.vendorList = [this.createNewVendor()];

    this.customersService.GetCstCode().subscribe(nmb=>{
      this.customerList[0].cstCode = nmb;
    });
  }
  createNewVendor() {
    return {
      vendID : undefined,
      vendName : undefined,
      comID: undefined,
      comName : undefined,
      vendCode : undefined,
      address : undefined,
      city : undefined,
      state : undefined,
      zip : undefined,
      vendPhone : undefined,
      vendFax : undefined,
      contName : undefined,
      contPhone : undefined,
      active : undefined,
      crtBy : undefined,
      crtDate : undefined,
      modby : undefined,
      modDate : undefined,
      vendTypeID : undefined,
      vendTypeName : undefined,
      email : undefined,
      isEmail : undefined,
      taxNo : undefined,
      taxValue : undefined
    };
  }

  saveCustomer()
  {
    if(this.customerList[0].cstCode == "" || this.customerList[0].cstCode == undefined)
    {
      this.toastr.error("Please write customer code");
      this.onEnterTableInputCst(-1);
    }
    else if(this.customerList[0].cstName == "" || this.customerList[0].cstName == undefined)
    {
      this.toastr.error("Please write customer name");
      this.onEnterTableInputCst(0);
    }
    else if(this.selectedArea == undefined){
      this.toastr.error("Please select area");
      this.onEnterTableInputCst(0);
    }
    else{
      this.customerList[0].cityID = this.selectedArea.LocationId;
      this.customerList[0].city = this.selectedArea.LocationName;
      if(!this.isCstSupp)
      {
        this.customerList[0].active = true;
        this.customerList[0].comID = localStorage.getItem("comID");
        this.customerList[0].comment = "true";
        this.isSaveDisable = true;
        this.customersService.saveCustomer(this.customerList[0]).subscribe({
          next: (cst:any) => {
            this.sharedDataService.updateCustomers$(cst);
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
            this.isSaveDisable = false;
          },
          error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInputCst(-1);
            this.isSaveDisable = false;
          },
        });
      }
      else
      {
        this.customerList[0].active = true;
        this.customerList[0].comID = localStorage.getItem("comID");
        this.customerList[0].comment = "true";

        this.vendorList[0].vendID = this.customerList[0].empID;
        this.vendorList[0].vendName = this.customerList[0].cstName;
        this.vendorList[0].vendCode = this.customerList[0].cstCode;
        this.vendorList[0].address = this.customerList[0].address;
        this.vendorList[0].comID = this.customerList[0].comID;
        this.vendorList[0].opnBal = this.customerList[0].vendorBal;
        this.vendorList[0].vendPhone = this.customerList[0].contPhone;
        this.vendorList[0].taxNo = this.customerList[0].taxNo;
        this.vendorList[0].taxValue = this.customerList[0].taxValue;
        this.vendorList[0].vendTypeID = 1;
        this.vendorList[0].active = true;
        this.isSaveDisable = true;
        this.vendorService.saveVendor(this.vendorList[0]).subscribe({
          next: (vnd:any) => {
            this.sharedDataService.updateVendors$(vnd);
            this.customerList[0].empID = vnd.vendID;
            this.customersService.saveCustomer(this.customerList[0]).subscribe({
              next: (cst:any) => {
                this.sharedDataService.updateCustomers$(cst);
                if(this.title == "Customer Registration")
                {
                  this.toastr.success("Customer and Supplier has been successfully added!");
                  this.dataEvent.emit({type:'added',value:cst});
                  this.isSaveDisable = false;
                }
                else
                {
                  this.toastr.success("Customer and Supplier has been successfully updated! "+cst.message);
                  this.dataEvent.emit({type:'',value:cst});
                  this.isSaveDisable = false;
                }
              },
              error: (response) => {
                this.toastr.error(response.error);
                this.onEnterTableInputCst(-1);
                this.isSaveDisable = false;
              },
            });

          },
          error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInputCst(-1);
            this.isSaveDisable = false;
          },
        });


      }
    }

  }
FoucsOnTab(event: KeyboardEvent){
  if(event.key==="Tab"){
    this.focusNextElement(event.target as HTMLElement);
    return;
  }
}
focusNextElement(currentElement: HTMLElement): void {
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(document.querySelectorAll<HTMLElement>(focusableSelectors));

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
      const nextElement = focusableElements[currentIndex + 1];
      nextElement.focus();
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

  close()
  {
    // this.customerCom.CustomerVisible = false;
    // this.saleCom.CustomersVisible = false;
    // this.quotationCom.CustomersVisible = false;
  }
}
