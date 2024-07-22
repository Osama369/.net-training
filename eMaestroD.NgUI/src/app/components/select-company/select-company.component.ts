import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Configuration } from 'src/app/models/configuration';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service';
import { Companies } from 'src/app/models/companies';
import { Tenants } from 'src/app/models/tenants';
import { ThemeService } from 'src/app/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LogoService } from 'src/app/services/logo.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css']
})
export class SelectCompanyComponent implements OnInit {
  constructor(private auth:AuthService,
    private layoutService: LayoutService,
    private toastr : ToastrService,
    private userService : UserService,
    private genericService : GenericService,
    private router : Router,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private authService : AuthService,
    private logoService : LogoService,
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }
  i:any=0;
  companylist : Companies[] = [];
  List : Tenants[] = [];
  checked : boolean = false;
  btnReg : boolean = false;
  AddCompanyVisible : boolean = false;
  NewCompanyList : Companies[] = [];
  check : boolean = false;
  ngOnInit(): void {
    this.auth.canAuthenticate();
    this.NewCompanyList = [{companyName:""}]
    this.List = [
        {
        tenantName:"",
        firstName:"",
        lastName:"",
        password:"",
        email:"",
        businessPhone:"",
      }
    ];

    this.genericService.getCompanylist().subscribe({
      next:(cmps:any)=>{
        this.companylist = cmps;
      }
    })
  }

  RegisterNewCompany()
  {
      if(this.NewCompanyList[0].companyName == undefined || this.NewCompanyList[0].companyName.trim() == "")
      {
        this.toastr.show("Please Write Company Name!");
      }
      else if(this.NewCompanyList[0].productionType == undefined || this.NewCompanyList[0].productionType.trim() == "" )
      {
        this.toastr.show("Please Write Company VAT/TAX No!");
      }
      else{
        this.check == true;
        this.toastr.show("Company Creating, Please Wait.....","",{ timeOut: 2000000 });
      this.genericService.saveConfiguration(this.NewCompanyList[0]).subscribe({
        next : (cmp:any) => {
          this.toastr.clear();
          this.companylist.push(cmp);
          this.NewCompanyList = [{companyName:""}]
          this.AddCompanyVisible = false;
          this.toastr.success("Successfully Created!");
        },
        error : (err) => {
          this.toastr.clear();
          this.toastr.error(err.error);
          this.AddCompanyVisible = false;
          this.check == false;
        },
      });
    }
  }
  SetCompany(row:any)
  {
      localStorage.setItem("comID",row.comID);
      localStorage.setItem("comName",row.companyName);
      localStorage.setItem("timeZone",row.timeZone);
      this.auth.canAuthenticate();
      this.themeService.switchTheme(row.theme);
      this.translateService.use(row.language);
      this.genericService.getLogoPath().subscribe(path=>{
        this.logoService.updateLogoPath(path);
       })
  }

  logout(){
    //remove token
    this.auth.removeToken();
    this.auth.canAccess();
    this.router.navigate(['/login']);
}

  openDailogForCreateNewCompany(){

    this.authService.checkPermission('CompanySettingCreate').subscribe(x=>{
      if(x)
      {
        this.AddCompanyVisible=true
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
  });
  }
}

