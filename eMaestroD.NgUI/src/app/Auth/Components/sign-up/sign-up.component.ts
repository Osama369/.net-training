import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  SearchCountryField,
  CountryISO
} from "ngx-intl-tel-input";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tenants } from 'src/app/Administration/Models/tenants';
import { TenantService } from 'src/app/Administration/Services/tenant.service';
import { AppConfigService } from '../../../Shared/Services/app-config.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  captchaResolved: boolean = false;
  key:any;
  checkCaptcha(captchaResponse : any) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
}
  constructor(private auth:AuthService,
    private layoutService: LayoutService,
    private toastr : ToastrService,
    private tenantService : TenantService,
    private router : Router,
    private appConfigService : AppConfigService
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }

  token: string|undefined;
  List : Tenants[] = [];
  checked : boolean = false;
  privacyCheck : boolean = false;
  filterCountryList : any[] = [];
  SelectedCountry : any;
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

  ngOnInit(): void {

    this.key = this.appConfigService.getConfig().Recaptcha.SiteKey;
    console.log(this.key);
    this.auth.canAuthenticate();
    this.List = [
        {
        tenantName:"",
        firstName:"",
        lastName:"",
        password:"",
        email:"",
        businessPhone:"",
        country:"",
        address1:"",
      }
    ];
  }

  validateEmail(email :any){
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(pattern)) {
      return true;
    }
    return false;
  }

  RegisterNewConfiguration()
  {
    if(
      this.List[0].tenantName == ""
     || this.List[0].firstName == ""
     || this.List[0].lastName == ""
     || this.List[0].email == ""
     || this.List[0].password == ""
     || this.List[0].businessPhone == ""
     || this.SelectedCountry == ""
     || this.privacyCheck != true
    )
    {
      this.toastr.error("Please Fill All Blanks!")
    }
    else  if(!this.validateEmail(this.List[0].email))
    {
      this.toastr.error("Email Address Incorrect!")
    }
    else
    {
      this.captchaResolved = false;
      this.List[0].isEmailConfirmed = false;
      this.List[0].connectionString = "";
      this.List[0].verificationCode = 0;
      this.List[0].country = this.SelectedCountry;
      this.toastr.info("Account Creating, Please Wait.....","",{ timeOut: 2000000 });
      this.tenantService.saveTenant(this.List[0]).subscribe({
        next : (value:any) => {
          sessionStorage.setItem("email",value.email);
          this.router.navigate(['/Confirmation']);
          this.toastr.clear();
        },
        error : (err) => {
          this.toastr.clear();
          this.toastr.error(err.error);
          grecaptcha.reset();
        },
      });
    }
  }

  filterCountry(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.countryList.length; i++) {
      let country = this.countryList[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filterCountryList = filtered;
  }




}

