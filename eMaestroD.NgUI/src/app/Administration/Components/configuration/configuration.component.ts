import { AppConfigService } from 'src/app/Shared/Services/app-config.service';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { LogoService } from 'src/app/Shared/Services/logo.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { ThemeService } from 'src/app/Shared/Services/theme.service';
import { Configuration } from '../../Models/configuration';
import { Companies } from '../../Models/companies';
import { Currency } from '../../Models/currency';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { ConfigSetting } from 'src/app/Shared/Models/config-setting';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  constructor(
    private toastr: ToastrService,
    private genericService : GenericService,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private themeService :ThemeService,
    private translateService: TranslateService,
    private authService : AuthService,
    private router: Router,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private logoService: LogoService,
    private sharedDataService : SharedDataService,
    private appConfigService : AppConfigService
  ) { }

  configurationList : Companies[] = [];
  filterCurrencyList : any[] = [];
  filterCountryList : any[] = [];
  filterTimeZoneList : any[] = [];
  SelectedCurrency : any;
  CurrencyList : Currency[] = [];
  SelectedTimeZone : any;
  TimeZoneList : any[] = [];
  editable : boolean = false;
  logo : any;
  @ViewChild('file') fileUpload: any;
  activeIndex: number = 0;
  SelectedCountry : any;
  printing = ['A4','Thermal'];
  filteredPrintingList:any;
  SelectedView:any;
  bookmark : boolean = false;
  configSetting : ConfigSetting[] = [];
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
  filterThemeList: any[] = [];
  filterLanguageList: any[] = [];

  SelectedTheme : any;

  themeList : any[] = [
    "lara-light-blue",
    "lara-dark-purple",
    "md-dark-indigo",
  ]

  SelectedLanguage : any;

  languageList : any[] = [
    {name:"English",val:"en"},
    {name:"Urdu",val:"ur"},
    {name:"Arabic",val:"ar"},
  ]

  ngOnInit() {
    this.getDetail();

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

  confirmDailog(element:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to '+element+'?',
      header: ' ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.getDetail();
        // this.editable = true;
        this.editable = false;
      }
    });
  }

  uploadfun(event:any) {
    this.logo = event.files;
  }

  filterCurrency(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
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

  filterPrintingName(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.printing.length; i++) {
      let printing = this.printing[i];
      if (printing.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(printing);
      }
    }
    this.filteredPrintingList = filtered;
  }


  filterTheme(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.themeList.length; i++) {
      let theme = this.themeList[i];
      if (theme.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(theme);
      }
    }
    this.filterThemeList = filtered;
  }



  changeTheme(theme: string) {
    if(theme != undefined)
    {
      this.themeService.switchTheme(theme);
    }
    else
    {
      this.themeService.switchTheme("lara-light-blue");
    }
  }

  filterLanguage(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.languageList.length; i++) {
      let lang = this.languageList[i];
      if (lang.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(lang);
      }
    }
    this.filterLanguageList = filtered;
  }

  changeLanguage(lang:string)
  {
      this.translateService.setDefaultLang(lang);
      this.translateService.use(lang);
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

  saveCompanyDetail()
  {
    this.authService.checkPermission('CompanySettingEdit').subscribe(x=>{
      if(x)
      {
          const formData = new FormData();
          formData.append('file', this.fileUpload.files[0]);

          if(this.configurationList[0].companyName == "" || this.configurationList[0].companyName == undefined
            && this.SelectedCurrency.Name == "" || this.SelectedCurrency.Name == undefined)
          {this.toastr.error("Please fill the empty blanks!");}
          else{
            this.configurationList[0].CurrencyCode = this.SelectedCurrency.CurrencyCode;
            this.configurationList[0].country = this.SelectedCountry;
            this.configurationList[0].theme = this.SelectedTheme;
            this.configurationList[0].language = this.SelectedLanguage.val;
            this.configurationList[0].timeZoneID = this.SelectedTimeZone == undefined ? null : this.SelectedTimeZone.timeZoneID;
            this.genericService.saveConfiguration(this.configurationList[0]).subscribe({
              next: (Gl) => {
                  this.getDetail();
                  this.editable = false;
                  this.toastr.success("Company Setting has been succesfully updated!");
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
          }
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });

  }

  getDetail()
  {
     this.configurationList.push(this.createNewConfiguration());
    this.genericService.getConfiguration().subscribe(asd => {
      this.configurationList = asd;
      this.configurationList.unshift(asd[0]);
      this.configurationList.splice(1,1);
      this.SelectedCurrency= {Name:this.configurationList[0].CurrencyName,CurrencyCode:this.configurationList[0].CurrencyCode};
      this.SelectedCountry= this.configurationList[0].country;
      this.SelectedTheme = this.configurationList[0].theme;
      this.SelectedView = this.configurationList[0].printView;
      let lst = this.languageList.filter(x=>x.val == this.configurationList[0].language);
      this.SelectedLanguage = {name:lst[0].name,val:this.configurationList[0].language};
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
    this.genericService.getAllCurrency().subscribe(asd => {
      this.CurrencyList = asd;
    });

    this.sharedDataService.getConfigSettings$().subscribe(data=>{
      this.configSetting = data;
      })

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

  saveConfigSettings()
  {
    this.sharedDataService.updateConfigSettings$(this.configSetting);
    this.toastr.success("Setting has been Successfully Saved.")
  }
}
