import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { GenericService } from '../../Services/generic.service';
import { LogoService } from '../../Services/logo.service';
import { ThemeService } from '../../Services/theme.service';
import { Companies } from 'src/app/Administration/Models/companies';
import { Tenants } from 'src/app/Administration/Models/tenants';
import { UserService } from 'src/app/Administration/Services/user.service';
import { APP_ROUTES } from 'src/app/app-routes';

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

  tenantlist: any[] = [];
  selectedTenant: string;

  ngOnInit(): void {
    this.auth.canAuthenticate();

    const storedTenantNames = localStorage.getItem('tenantNames');
    if (storedTenantNames) {
      this.tenantlist = JSON.parse(storedTenantNames);
      const primaryTenant = this.tenantlist.find(tenant => tenant.isPrimary);
      if (primaryTenant) {
        this.selectedTenant = primaryTenant.tenantID;
      }
    }
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

  async setTenant(tenantId: string) {
    try {
      const data: any = await firstValueFrom(this.authService.UpdateConnectionString(tenantId));
      this.auth.storeToken(data.idToken);
      const storedTenantNames = localStorage.getItem('tenantNames');
      if (storedTenantNames) {
        this.tenantlist = JSON.parse(storedTenantNames);

        // Update isPrimary for the selected tenant
        this.tenantlist.forEach(tenant => {
          tenant.isPrimary = tenant.tenantID === tenantId;
        });

        // Save updated tenant list back to localStorage
        localStorage.setItem('tenantNames', JSON.stringify(this.tenantlist));
      }

      const cmps: any = await firstValueFrom(this.genericService.getCompanylist());
      this.companylist = cmps;
    } catch (error) {
      console.error('Error:', error);
    }
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
    this.router.navigate([APP_ROUTES.account.login]);
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

