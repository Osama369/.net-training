import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { VendorsComponent } from '../vendors.component';


@Component({
  selector: 'app-add-new-vendor',
  templateUrl: './add-new-vendor.component.html',
  styleUrls: ['./add-new-vendor.component.css'],
})
export class AddNewVendorComponent {
  @Input() VendorVisible : boolean;
  vendorList: Vendor[];
  customerList: Customer[];
  @ViewChildren('inputFieldTableVend') inputFieldTableVend: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() vndData : any;
  @Input() title : any;
  isEdit: boolean = false;

  isCstSupp : boolean = false;
  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.vendorList = [this.createNewVendor()];
    this.customerList = [this.createNewCustomer()];
    this.vendorService.GetVndCode().subscribe(nmb=>{
      this.vendorList[0].vendCode = nmb;
    });
  }
  constructor(
    private router: Router,
    private citiesService:CitiesService,
    private vendorService:VendorService,
    private customersService:CustomersService,
    private toastr: ToastrService,
    private el: ElementRef,
    private vendorCom: VendorsComponent
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if(this.vndData != undefined && this.vndData.length != 0)
    {
      // this.isEdit = true;
      this.vendorList[0] = this.vndData;
    }
    else
    {
      // this.isEdit = false;
      this.clear();
    }
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

}
  clear()
  {
    this.vendorList = [this.createNewVendor()];
    this.customerList = [this.createNewCustomer()];
    this.vendorService.GetVndCode().subscribe(nmb=>{
      this.vendorList[0].vendCode = nmb;
    });
  }
  close()
  {
    //this.vendorCom.VendorVisible=false;
    //this.purchaseCom.VendorVisible=false;
  }
  saveVendor()
  {
    if(this.vendorList[0].vendCode == "" || this.vendorList[0].vendCode == undefined)
    {
      this.toastr.error("Please write supplier code");
      this.onEnterTableInputCst(-1);
    }
    else if(this.vendorList[0].vendName == "" || this.vendorList[0].vendName == undefined)
    {
      this.toastr.error("Please write supplier name");
      this.onEnterTableInputCst(0);
    }
    else{
      if(!this.isCstSupp)
      {
        this.vendorList[0].comID = localStorage.getItem('comID');
        this.vendorList[0].vendTypeID = 1;
        this.vendorList[0].active = true;
        this.vendorList[0].isEmail = true;

        this.vendorService.saveVendor(this.vendorList[0]).subscribe({
          next: (vnd:any) => {
            if(this.title == "Supplier Registration")
            {
              this.toastr.success("Supplier has been successfully added!");
              this.dataEvent.emit({type:'added',value:vnd});
            }
            else
            {
              this.toastr.success("Supplier has been successfully updated! "+vnd.message);
              this.dataEvent.emit({type:'',value:vnd});
            }

          },
          error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInputCst(-1);
          },
        });
      }
      else
      {
        this.vendorList[0].comID = localStorage.getItem('comID');
        this.vendorList[0].vendTypeID = 1;
        this.vendorList[0].active = true;
        this.vendorList[0].isEmail = true;

        this.customerList[0].empID = this.vendorList[0].vendID;
        this.customerList[0].cstName = this.vendorList[0].vendName;
        this.customerList[0].cstCode = this.vendorList[0].vendCode;
        this.customerList[0].address = this.vendorList[0].address;
        this.customerList[0].comID = this.vendorList[0].comID;
        this.customerList[0].contPhone = this.vendorList[0].vendPhone;
        this.customerList[0].taxNo = this.vendorList[0].taxNo;
        this.customerList[0].taxValue = this.vendorList[0].taxValue;
        this.customerList[0].active = true;
        this.customerList[0].comment = "true";

        this.vendorService.saveVendor(this.vendorList[0]).subscribe({
          next: (vnd:any) => {
            this.customerList[0].empID = vnd.vendID;
            this.customersService.saveCustomer(this.customerList[0]).subscribe({
              next: (cst:any) => {
                if(this.title == "Supplier Registration")
                {
                  this.toastr.success("Supplier and Customer has been successfully added!");
                  this.dataEvent.emit({type:'added',value:vnd});
                }
                else
                {
                  this.toastr.success("Supplier and Customer has been successfully updated! "+vnd.message);
                  this.dataEvent.emit({type:'',value:vnd});
                }
              },
              error: (response) => {
                this.toastr.error(response.error);
                this.onEnterTableInputCst(-1);
              },
            });
          }
        });
      }
    }


  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTableVend.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTableVend.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
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


  createNewCustomer() {
    return {
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
      isLicence : undefined,
      city : undefined,
      state : undefined,
      active : undefined,
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
    };
  }
}
