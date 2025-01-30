import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Tenants } from 'src/app/models/tenants';
import { TenantService } from 'src/app/services/tenant.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})

export class AddNewComponent {
  constructor(
    private router: Router,
    private _TenantService:TenantService,
    private _ToastrService : ToastrService
  ) {}

  @Input() taxVisible : boolean;
  list: Tenants[];
  tenantList: Tenants[];
  @ViewChildren('inputFieldTable') inputFieldTable: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() title : any;
  @Input() DATA : any;

  dropdownlist : any = ["false","true"];
  dropdownlistType : any = ["Trial","License"];
  SelectedEmailConfirm : any;
  SelectedSuspended : any;
  SelectedType : any;
  SelectedSubDate : any;
  SelectedSubEndDate:any;
  SelectedCountry:any;
  countryList : any[] = [
    "Afghanistan"
    ,"Albania"
    ,"Algeria"
    ,"Andorra"
    ,"Angola"
    ,"Antigua & Deps"
    ,"Argentina"
    ,"Armenia"
    ,"Australia"
    ,"Austria"
    ,"Azerbaijan"
    ,"Bahamas"
    ,"Bahrain"
    ,"Bangladesh"
    ,"Barbados"
    ,"Belarus"
    ,"Belgium"
    ,"Belize"
    ,"Benin"
    ,"Bhutan"
    ,"Bolivia"
    ,"Bosnia Herzegovina"
    ,"Botswana"
    ,"Brazil"
    ,"Brunei"
    ,"Bulgaria"
    ,"Burkina"
    ,"Burundi"
    ,"Cambodia"
    ,"Cameroon"
    ,"Canada"
    ,"Cape Verde"
    ,"Central African Rep"
    ,"Chad"
    ,"Chile"
    ,"China"
    ,"Colombia"
    ,"Comoros"
    ,"Congo"
    ,"Congo {Democratic Rep}"
    ,"Costa Rica"
    ,"Croatia"
    ,"Cuba"
    ,"Cyprus"
    ,"Czech Republic"
    ,"Denmark"
    ,"Djibouti"
    ,"Dominica"
    ,"Dominican Republic"
    ,"East Timor"
    ,"Ecuador"
    ,"Egypt"
    ,"El Salvador"
    ,"Equatorial Guinea"
    ,"Eritrea"
    ,"Estonia"
    ,"Ethiopia"
    ,"Fiji"
    ,"Finland"
    ,"France"
    ,"Gabon"
    ,"Gambia"
    ,"Georgia"
    ,"Germany"
    ,"Ghana"
    ,"Greece"
    ,"Grenada"
    ,"Guatemala"
    ,"Guinea"
    ,"Guinea-Bissau"
    ,"Guyana"
    ,"Haiti"
    ,"Honduras"
    ,"Hungary"
    ,"Iceland"
    ,"India"
    ,"Indonesia"
    ,"Iran"
    ,"Iraq"
    ,"Ireland {Republic}"
    ,"Israel"
    ,"Italy"
    ,"Ivory Coast"
    ,"Jamaica"
    ,"Japan"
    ,"Jordan"
    ,"Kazakhstan"
    ,"Kenya"
    ,"Kiribati"
    ,"Korea North"
    ,"Korea South"
    ,"Kosovo"
    ,"Kuwait"
    ,"Kyrgyzstan"
    ,"Laos"
    ,"Latvia"
    ,"Lebanon"
    ,"Lesotho"
    ,"Liberia"
    ,"Libya"
    ,"Liechtenstein"
    ,"Lithuania"
    ,"Luxembourg"
    ,"Macedonia"
    ,"Madagascar"
    ,"Malawi"
    ,"Malaysia"
    ,"Maldives"
    ,"Mali"
    ,"Malta"
    ,"Marshall Islands"
    ,"Mauritania"
    ,"Mauritius"
    ,"Mexico"
    ,"Micronesia"
    ,"Moldova"
    ,"Monaco"
    ,"Mongolia"
    ,"Montenegro"
    ,"Morocco"
    ,"Mozambique"
    ,"Myanmar"
    ,"Namibia"
    ,"Nauru"
    ,"Nepal"
    ,"Netherlands"
    ,"New Zealand"
    ,"Nicaragua"
    ,"Niger"
    ,"Nigeria"
    ,"Norway"
    ,"Oman"
    ,"Pakistan"
    ,"Palau"
    ,"Panama"
    ,"Papua New Guinea"
    ,"Paraguay"
    ,"Peru"
    ,"Philippines"
    ,"Poland"
    ,"Portugal"
    ,"Qatar"
    ,"Romania"
    ,"Russian Federation"
    ,"Rwanda"
    ,"St Kitts & Nevis"
    ,"St Lucia"
    ,"Saint Vincent & the Grenadines"
    ,"Samoa"
    ,"San Marino"
    ,"Sao Tome & Principe"
    ,"Saudi Arabia"
    ,"Senegal"
    ,"Serbia"
    ,"Seychelles"
    ,"Sierra Leone"
    ,"Singapore"
    ,"Slovakia"
    ,"Slovenia"
    ,"Solomon Islands"
    ,"Somalia"
    ,"South Africa"
    ,"South Sudan"
    ,"Spain"
    ,"Sri Lanka"
    ,"Sudan"
    ,"Suriname"
    ,"Swaziland"
    ,"Sweden"
    ,"Switzerland"
    ,"Syria"
    ,"Taiwan"
    ,"Tajikistan"
    ,"Tanzania"
    ,"Thailand"
    ,"Togo"
    ,"Tonga"
    ,"Trinidad & Tobago"
    ,"Tunisia"
    ,"Turkey"
    ,"Turkmenistan"
    ,"Tuvalu"
    ,"Uganda"
    ,"Ukraine"
    ,"United Arab Emirates"
    ,"United Kingdom"
    ,"United States"
    ,"Uruguay"
    ,"Uzbekistan"
    ,"Vanuatu"
    ,"Vatican City"
    ,"Venezuela"
    ,"Vietnam"
    ,"Yemen"
    ,"Zambia"
    ,"Zimbabwe"

      ]

  sendDataToParent() {
    // this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.tenantList = [{
      firstName :"",
      lastName :"",
      address1:"",
      email:"",
      isEmailConfirmed: false,
      subscriptionType : "",
      subscriptionDate : "",
      subscriptionEndDate : "",
      isSuspended : false,
      maxUserCount : 0,
      maxCompaniesCount : 0
    }];
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.DATA != undefined && this.DATA.length != 0)
    {
       this.tenantList[0] = this.DATA;
       this.SelectedEmailConfirm = String(this.tenantList[0].isEmailConfirmed);
       this.SelectedSuspended = String(this.tenantList[0].isSuspended);
       this.SelectedType = String(this.tenantList[0].subscriptionType);
        this.SelectedSubDate = new Date(this.tenantList[0].subscriptionDate);
        this.SelectedSubEndDate = new Date(this.tenantList[0].subscriptionEndDate);
        this.SelectedCountry = this.tenantList[0].country;
    }
    else
    {
       this.clear();
    }
}

  clear()
  {
    this.tenantList = [{
      firstName :"",
      lastName :"",
      address1:"",
      email:"",
      isEmailConfirmed: false,
      subscriptionType : "",
      subscriptionDate : "",
      subscriptionEndDate : "",
      isSuspended : false,
      maxUserCount : 0,
      maxCompaniesCount : 0
    }];
  }


  saveTax()
  {
    if(
      this.tenantList[0].email != undefined && this.tenantList[0].email != ""
    )
    {
      this.tenantList[0].isEmailConfirmed = this.SelectedEmailConfirm
      this.tenantList[0].isSuspended = this.SelectedSuspended;
      this.tenantList[0].subscriptionType =this.SelectedType;
      this.tenantList[0].subscriptionDate = this.SelectedSubDate.toLocaleString();;
      this.tenantList[0].subscriptionEndDate = this.SelectedSubEndDate.toLocaleString();;
        this._TenantService.saveTenant(this.tenantList[0]).subscribe({
          next: (data: any) => {

            this._ToastrService.success("Successfully Updated");
              this.dataEvent.emit({type:'',value:data});
            },
            error: (response : any) => {
              this._ToastrService.error(response.error);
              this.onEnterTableInputCst(-1);
            },
          })
    }
    else
    {
      this._ToastrService.error('Please Fill Empty Blanks');
      this.onEnterTableInputCst(-1);
    }
  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTable.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
      if(this.tenantList[0].tenantName != ""  && this.tenantList[0].email != undefined
      )
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this._ToastrService.error('Please Fill Empty Blanks');
        this.onEnterTableInputCst(-1);
      }
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTable.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

}
