import { filter } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, NgZone, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import jwt_decode, { jwtDecode } from "jwt-decode";
import { Companies } from '../Administration/Models/companies';
import { Users } from '../Administration/Models/users';
import { NotificationService } from '../Administration/Services/notification.service';
import { UserService } from '../Administration/Services/user.service';
import { AuthService } from '../Shared/Services/auth.service';
import { BookmarkService } from '../Shared/Services/bookmark.service';
import { GenericService } from '../Shared/Services/generic.service';
import { LogoService } from '../Shared/Services/logo.service';
import { SignalrService } from '../Shared/Services/signalr.service';
import { ThemeService } from '../Shared/Services/theme.service';
import { AppConfigService } from '../Shared/Services/app-config.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  constructor(
    public auth:AuthService,
    public layoutService: LayoutService,
    private toastr : ToastrService,
    private userService : UserService,
    private genericService : GenericService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private authService: AuthService,
    private signalRService : SignalrService,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    public bookmarkService: BookmarkService,
    private cdr: ChangeDetectorRef,
    private logoService: LogoService,
    private appConfigService: AppConfigService
    ) {
      this.user.push(new Users());
      this.signalRService.unsubscribe();
      this.signalRService.startConnection();
    this.signalRService.addMessageListner();
  }
    changeCompanyVisibility:boolean = false;
    config = this.appConfigService.getConfig();
    path : any = this.config.LogoPath;
    items!: MenuItem[];

    user:Users[]=[];

    newPassword:any = "";
    oldPassword:any = "";
    resetPasswordVisibility : boolean= false;
    companylist : Companies[] = [];
    checked : boolean = false;
    btnReg : boolean = false;
    AddCompanyVisible : boolean = false;
    NewCompanyList : Companies[] = [];
    companyName : any;
    check : boolean = false;
    mySubscription: any;
    notificationList$: any[] = [];
    notificationLength : any;
    showUserInfo: boolean = false;
    userEmail: any; // Replace with actual user data

    // changeLangage(lang: string) {
    //   // let htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    //   // htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    //   this.translateService.setDefaultLang(lang);
    //   this.translateService.use(lang);
    // }
    ngOnInit(): void {

    //  if(localStorage.getItem("comID") != null)
     // {

        const jwtToken = localStorage.getItem("token");
        // Decode the JWT token
        if(jwtToken != null)
        {
          var decodedToken: any = jwtDecode(jwtToken);
          // Access the UPN claim
          var email: string = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          this.userEmail =  email;
        }

        this.bookmarkService.GetAllBookmarkScreens();
        this.authService.checkPermission('Notification').subscribe(x=>{
          if(x)
          {


          this.notificationService.GetNotification().subscribe(list=>{
              this.notificationList$ = list.filter(x=>x.comID == localStorage.getItem("comID"));
              this.notificationLength = this.notificationList$.filter(x=>x.active == true).length;
            })

          this.signalRService.getNotificationObservable().subscribe((notification: any) => {
          this.ngZone.run(() => {
            // Decode the JWT token
            if(jwtToken != null)
            {
              var decodedToken: any = jwtDecode(jwtToken);
              // Access the UPN claim
              var tenantID: string = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"];
              if (notification.comID == localStorage.getItem("comID") && notification.tenantID == tenantID) {
                  this.notificationLength++;
                  this.notificationList$.unshift(notification); // Add new notification to the beginning of the list
              }
            }
            });
          });


          this.signalRService.ClearNotification().subscribe((notification: any) => {
            this.ngZone.run(() => {
              this.notificationService.GetNotification().subscribe(list=>{
                this.notificationList$ = list.filter(x=>x.comID == localStorage.getItem("comID"));
                this.notificationLength = this.notificationList$.filter(x=>x.active == true).length;
              })
              });
            });
          }
          else{
            // this.toastr.error("Unauthorized Access! You don't have permission to access.");
          }
        });
      //}

      this.NewCompanyList = [{companyName:""}]
      this.companyName = localStorage.getItem('comName');
       // Assuming you have the JWT token

       this.genericService.getLogoPath().subscribe(path=>{
        this.logoService.updateLogoPath(path);
          this.logoService.logoPath$.subscribe(pat => {
            this.config.LogoPath = pat;
            this.path = pat;
          });
       })



      if(this.auth.isAuthenticated())
      {
        this.genericService.getCompanylist().subscribe({
        next:(cmps:any)=>{
          this.companylist = cmps;
          this.companylist = this.companylist.filter(x=>x.comID != localStorage.getItem('comID'));
          let activeCompany = cmps.filter((x:any)=>x.comID == localStorage.getItem('comID'));
          if(activeCompany[0].theme != null && activeCompany[0].theme != undefined)
          {
            this.themeService.switchTheme(activeCompany[0].theme);
          }

          if(activeCompany[0].language != null && activeCompany[0].language != undefined)
          {
            this.translateService.setDefaultLang(activeCompany[0].language);
            this.translateService.use(activeCompany[0].language);
          }
          else
          {
            this.translateService.setDefaultLang('en');
            this.translateService.use('en');
          }
        }
      })
      }
    }

    updateNotification()
    {
      this.notificationLength = 0;
    }

    ngOnChanges(changes: SimpleChanges) {
      this.companyName = localStorage.getItem('comName');
      // changes.prop contains the old and the new value...

    }

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    logout(){
        //remove token
        this.config.LogoPath = "assets/layout/images/logo.png";
        this.path = this.config.LogoPath;
        this.auth.removeToken();
        this.auth.canAccess();
        this.router.navigate(['/login']);
        this.changeCompanyVisibility = false;
        this.themeService.switchTheme('lara-light-blue');
        this.translateService.setDefaultLang('en');
        this.translateService.use('en');

    }

    changeCompany()
    {

      localStorage.removeItem("comID");
      localStorage.removeItem("comName");
      localStorage.removeItem("timeZone");
      this.auth.canAuthenticate();
      // this.genericService.getCompanylist().subscribe({
      //   next:(cmps:any)=>{
      //     this.companylist = cmps;
      //     this.companylist = this.companylist.filter(x=>x.comID != localStorage.getItem('comID'));
      //   }
      // })
      // this.changeCompanyVisibility = true;

      // this.router.navigate(['/SelectCompany']);
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
      else
      {
        this.check == true;
        this.toastr.show("Company Creating, Please Wait.....","",{ timeOut: 2000000 });
        this.NewCompanyList[0].active = true;
        this.genericService.saveConfiguration(this.NewCompanyList[0]).subscribe({
        next : (cmp:any) => {
          this.toastr.clear();
          this.companylist.push(cmp);
          this.NewCompanyList = [{companyName:""}]
          this.AddCompanyVisible = false;
          this.toastr.success("Successfully Created.");
        },
        error : (err) => {
          this.toastr.clear();
          this.toastr.error(err.error);
          this.AddCompanyVisible = false;
          this.check = false;
        },
        });
      }
    }

    SetCompany(row:any)
    {
        localStorage.setItem("comID",row.comID);
        localStorage.setItem("comName",row.companyName);
        localStorage.setItem("timeZone",row.timeZone);
        this.companyName = localStorage.getItem('comName');
        this.auth.canAuthenticate();
        this.changeCompanyVisibility = false;
         let currentRout =window.location.href;
        if(currentRout.match("Dashboard") != null)
        {
          window.location.reload()
        }
        this.themeService.switchTheme(row.theme);
        this.translateService.use(row.language);
        this.genericService.getLogoPath().subscribe(path=>{
          this.logoService.updateLogoPath(path);
         })
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

  ResetView()
  {
        this.newPassword = "";
        this.oldPassword = "";
        this.resetPasswordVisibility = true;
  }

  ResetPassword()
  {
    if(this.newPassword == "" && this.oldPassword == ""){
      this.toastr.error("Please Enter Password");
    }
    else if(this.newPassword == this.oldPassword)
    {
      this.toastr.error("New password must be different from old password.");
    }
    else{

      this.user.push(new Users());
      this.user[0].modBy = this.oldPassword;
      this.user[0].password = this.newPassword;

      this.userService.ChangePassword(this.user[0]).subscribe({
        next:(result)=>{
          this.toastr.success("Password Changed Successfully.");
          this.resetPasswordVisibility = false;
        },
        error:(responce)=>{
          this.toastr.error(responce.error);
        }
      })
    }
  }

  NotificationView(op:any,event:any)
  {
    this.authService.checkPermission('Notification').subscribe(x=>{
      if(x)
      {
        op.toggle(event);
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
  });
  }


  imageexists(url:any, callback:any) {
    var img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
  }

  redirectToInvoice(invoiceNo : any)
  {
    var prefix = invoiceNo.substring(0, 3);
    if(prefix == "PNV" || prefix == "PRT" || prefix == "POV" ||
    prefix == "SNV" || prefix == "SRT" || prefix == "SRV" || prefix == "QOV"){
     const url = this.router.serializeUrl(
       this.router.createUrlTree([`Detail/`+invoiceNo])
     );
     window.open(url, '_blank');
   }
   else if (prefix == "RCT" || prefix == "PMT"){
     const url = this.router.serializeUrl(
       this.router.createUrlTree([`VoucherDetail/`+invoiceNo])
     );
     window.open(url, '_blank');
   }
   else if(prefix == "JV-"){
     const url = this.router.serializeUrl(
       this.router.createUrlTree([`JournalVoucherDetail/`+invoiceNo])
     );
     window.open(url, '_blank');
   }
  }
}
