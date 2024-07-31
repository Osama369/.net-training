import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../Services/auth.service';
import { PaymentDetail } from 'src/app/models/payment-detail';
import { Tenants } from 'src/app/models/tenants';
import { TenantService } from 'src/app/services/tenant.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
    private cdr : ChangeDetectorRef
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }


  paypalVisiblity : boolean = false;

  token: string|undefined;
  List : Tenants[] = [];
  checked : boolean = false;
  privacyCheck : boolean = false;
  filterPlanList : any[] = [];
  SelectedPlan : any;
  subscriptionDuration : any = "Monthly";

  addUser : any = 0;
  userPrice : any = 6;
  addCompany : any = 0;
  companyPrice : any = 6;
  addLocation : any = 0;
  locationPrice : any = 6;
  totalAddOnCharges : any = 0;
  totalCharges : any = 0;

  companiesCount:any = 0;
  locationsCount:any = 0;
  usersCount:any = 0;

  plans : any[] = [
  "Basic",
  "Standard",
  "Premium"
  ]
  planAmount: any = 0;

  basicList : any[] = [
    "Sale",
    "Purchase",
     (this.addUser+2)+"x Users",
     (this.addCompany+2)+"x Companies",
     (this.addLocation+2)+"x Locations",
  ]


  StandardList : any[] = [
    "Sale",
    "Purchase",
     (this.addUser+5)+"x Users",
     (this.addCompany+5)+"x Companies",
     (this.addLocation+5)+"x Locations",
  ]

  PremiumList : any[] = [
    "Sale",
    "Purchase",
    (this.addUser+10)+"x Users",
    (this.addCompany+10)+"x Companies",
    (this.addLocation+10)+"x Locations",
  ]


  ngOnInit(): void {

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
     || this.SelectedPlan == ""
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
      this.List[0].country = this.SelectedPlan;
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

  FilterPlan(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.plans.length; i++) {
      let list = this.plans[i];
      if (list.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(list);
      }
    }
    this.filterPlanList = filtered;
  }

  changePaymentValue()
  {
    if(this.SelectedPlan == "Basic"){this.planAmount = "9.99"}
    else if(this.SelectedPlan == "Standard"){this.planAmount = "17.92"}
    else if(this.SelectedPlan == "Premium"){this.planAmount = "62.29"}
    this.totalCharges =  parseFloat(this.planAmount)+parseFloat(this.totalAddOnCharges);
  }

  calculateTotal()
  {
    this.totalAddOnCharges =  (parseFloat(this.userPrice)*parseFloat(this.addUser))+ (parseFloat(this.companyPrice)*parseFloat(this.addCompany)) + (parseFloat(this.locationPrice)*parseFloat(this.addLocation));
    this.totalCharges =  parseFloat(this.planAmount)+parseFloat(this.totalAddOnCharges);

    this.basicList = [
      "Sale",
      "Purchase",
      (this.addUser+2)+"x Users",
       (this.addCompany+2)+"x Companies",
      (this.addLocation+2)+"x Locations",
    ]


    this.StandardList = [
      "Sale",
      "Purchase",
      (this.addUser+5)+"x Users",
       (this.addCompany+5)+"x Companies",
       (this.addLocation+5)+"x Locations",
    ]

    this.PremiumList  = [
      "Sale",
      "Purchase",
       (this.addUser+10)+"x Users",
      (this.addCompany+10)+"x Companies",
       (this.addLocation+10)+"x Locations",
    ]
  }

  CheckOut()
  {

    if(this.List[0].email == undefined || this.List[0].email == ""){
      this.toastr.error("Please Write Email Address!");
    }
    else  if(!this.validateEmail(this.List[0].email))
    {
      this.toastr.error("Email Address Incorrect!")
    }
    else if(this.SelectedPlan == undefined || this.SelectedPlan == ""){
      this.toastr.error("Please Select Plan!");
    }
    else{

      if(this.SelectedPlan == "Basic"){
        this.usersCount = this.basicList[2];
        this.companiesCount = this.basicList[3];
        this.locationsCount = this.basicList[4];
      }else if(this.SelectedPlan == "Standard"){
        this.usersCount = this.StandardList[2];
        this.companiesCount = this.StandardList[3];
        this.locationsCount = this.StandardList[4];
      }else if(this.SelectedPlan == "Premium"){
        this.usersCount = this.PremiumList[2];
        this.companiesCount = this.PremiumList[3];
        this.locationsCount = this.PremiumList[4];
      }

      this.tenantService.VerifyEmailAddress(this.List[0].email).subscribe({
        next:(result:any)=>{
          this.paypalVisiblity = true;
          this.loadPayPalSdk().then(() => {
            this.initPayPalButton();
          });
        },
        error:(responce:any)=>{
          this.toastr.error(responce.error);
        }
      })
    }
  }

  paypal: any;

  ngAfterViewInit(): void {

  }

  private loadPayPalSdk(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      const clientId = environment.paypalClientId;
      scriptElement.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=ATGaARsSwiWaJ0z7bDm5LhjAwd2MfRp7w5xCOhTDgfso4YG0XEXGUW8c45N8ufeBummDtQl67e38u-CQ';
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.body.appendChild(scriptElement);
    });
  }

  private initPayPalButton(): void {
    let totalCharges = this.totalCharges; // Sample amount
  let roundedTotalCharges = totalCharges.toFixed(2);
    if ((window as any).paypal) {
      (window as any).paypal.Buttons({
        createOrder: (data:any, actions:any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: roundedTotalCharges // Sample amount
              }
            }]
          });
        },
        onApprove: (data:any, actions:any) => {
          return actions.order.capture().then((details:any) => {
            this.paypalVisiblity = false;
            const payment = this.mapToPaymentModel(details);
            this.toastr.info("Payment Verifying, Please Wait.....","",{ timeOut: 2000000 });
            this.tenantService.saveTenantPaymentDetail(payment).subscribe(response => {
                this.toastr.clear();
                this.toastr.success("Payment Successfully Verified, You can now log in to eMaestro!","",);
                this.router.navigate(['/login']);
              }, error => {
                this.toastr.clear();
                this.toastr.error("Something went wrong");
              });
          });
        }
      }).render('#paypal-button-container');
    } else {
      // Handle case when PayPal SDK is not available
      console.error('PayPal SDK not loaded');
    }
  }

  private mapToPaymentModel(details: any): PaymentDetail {
    const purchaseUnit = details.purchase_units[0] ?? {};
    const capture = purchaseUnit.payments?.captures[0] ?? {};

    const selfLink = capture.links?.find((link: { rel: string; }) => link.rel === 'self') ?? {};
    const refundLink = capture.links?.find((link: { rel: string; }) => link.rel === 'refund') ?? {};
    const upLink = capture.links?.find((link: { rel: string; }) => link.rel === 'up') ?? {};

    return new PaymentDetail({
      id: details.id ?? '',
      createTime: new Date(details.create_time) || new Date(),
      updateTime: new Date(details.update_time) || new Date(),
      intent: details.intent ?? '',
      status: details.status ?? '',
      payerEmail: details.payer?.email_address ?? '',
      payerId: details.payer?.payer_id ?? '',
      payerCountryCode: details.payer?.address?.country_code ?? '',
      payerGivenName: details.payer?.name?.given_name ?? '',
      payerSurname: details.payer?.name?.surname ?? '',
      referenceId: purchaseUnit.reference_id ?? '',
      amountValue: parseFloat(purchaseUnit.amount?.value) || 0,
      amountCurrency: purchaseUnit.amount?.currency_code ?? '',
      payeeEmail: purchaseUnit.payee?.email_address ?? '',
      merchantId: purchaseUnit.payee?.merchant_id ?? '',
      shippingFullName: purchaseUnit.shipping?.name?.full_name ?? '',
      shippingAddressLine1: purchaseUnit.shipping?.address?.address_line_1 ?? '',
      shippingAddressLine2: purchaseUnit.shipping?.address?.address_line_2 ?? '',
      adminArea2: purchaseUnit.shipping?.address?.admin_area_2 ?? '',
      adminArea1: purchaseUnit.shipping?.address?.admin_area_1 ?? '',
      postalCode: purchaseUnit.shipping?.address?.postal_code ?? '',
      countryCode: purchaseUnit.shipping?.address?.country_code ?? '',
      captureId: capture.id ?? '',
      captureStatus: capture.status ?? '',
      captureCreateTime: new Date(capture.create_time) || new Date(),
      captureUpdateTime: new Date(capture.update_time) || new Date(),
      captureAmountValue: parseFloat(capture.amount?.value) || 0,
      captureAmountCurrency: capture.amount?.currency_code ?? '',
      finalCapture: capture.final_capture ?? false,
      sellerProtectionStatus: capture.seller_protection?.status ?? '',
      disputeCategories: capture.seller_protection?.dispute_categories?.join(',') ?? '',
      selfLinkHref: selfLink?.href ?? '',
      selfLinkRel: selfLink?.rel ?? '',
      selfLinkMethod: selfLink?.method ?? '',
      selfLinkTitle: selfLink?.title ?? '',
      refundLinkHref: refundLink?.href ?? '',
      refundLinkRel: refundLink?.rel ?? '',
      refundLinkMethod: refundLink?.method ?? '',
      refundLinkTitle: refundLink?.title ?? '',
      upLinkHref: upLink?.href ?? '',
      upLinkRel: upLink?.rel ?? '',
      upLinkMethod: upLink?.method ?? '',
      upLinkTitle: upLink?.title ?? '',
      subscriptionPlan: this.SelectedPlan, // Assign this appropriately
      tenantEmailAddress : this.List[0].email,
      companiesCount : this.getCompaniesCountAsInt(),
      usersCount : this.getUsersCountAsInt(),
      locationCount : this.getLocationsCountAsInt(),
      subscriptionDuration : this.subscriptionDuration
    });
  }

  private extractNumber(value: string): number {
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  getUsersCountAsInt(): number {
    return this.extractNumber(this.usersCount);
  }

  getCompaniesCountAsInt(): number {
    return this.extractNumber(this.companiesCount);
  }

  getLocationsCountAsInt(): number {
    return this.extractNumber(this.locationsCount);
  }
}

