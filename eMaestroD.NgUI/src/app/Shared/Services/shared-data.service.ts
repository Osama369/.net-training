import { Users } from './../../Administration/Models/users';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { Injectable } from '@angular/core';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';
import { BehaviorSubject, defaultIfEmpty, forkJoin, lastValueFrom, Observable, of, tap } from 'rxjs';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { Location } from 'src/app/Administration/Models/location';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { Customer } from 'src/app/Manage/Models/customer';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { InvoiceReportSettings } from 'src/app/Reports/Models/invoice-report-settings';
import { Taxes } from 'src/app/Administration/Models/taxes';
import { TaxesService } from 'src/app/Administration/Services/taxes.service';
import { ConfigSetting } from '../Models/config-setting';
import { AppConfigService } from './app-config.service';
import { UserService } from 'src/app/Administration/Services/user.service';

@Injectable()
export class SharedDataService {
  private isLoaded: boolean = false;
  private storedComID: any;
  private storedTenantID: any;

  private productsSubject: BehaviorSubject<ProductViewModel[]> = new BehaviorSubject<ProductViewModel[]>([]);
  private locationSubject: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
  private vendorSubject: BehaviorSubject<Vendor[]> = new BehaviorSubject<Vendor[]>([]);
  private customerSubject: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>([]);
  private reportSettingItemSubject: BehaviorSubject<InvoiceReportSettings[]> = new BehaviorSubject<InvoiceReportSettings[]>([]);
  private taxesSubject: BehaviorSubject<Taxes[]> = new BehaviorSubject<Taxes[]>([]);
  private configSettingSubject: BehaviorSubject<ConfigSetting[]> = new BehaviorSubject<ConfigSetting[]>([]);
  private usersSubject: BehaviorSubject<Users[]> = new BehaviorSubject<Users[]>([]);

  constructor(
    private _productsService: ProductsService,
    private _locationService: LocationService,
    private _customerService: CustomersService,
    private _vendorService: VendorService,
    private _reportSettingService: ReportSettingService,
    private _taxesService: TaxesService,
    private _appConfigService: AppConfigService,
    private _userService : UserService
  ) {
    this.storedComID = localStorage.getItem('comID');
    this.storedTenantID = localStorage.getItem('tenantID');

    this.loadAllData().subscribe();
  }

  loadAllData(): Observable<any> {
    console.log("in");

     const currentComID = localStorage.getItem('comID');
     const currentTenantID = localStorage.getItem('tenantID');
  if (this.isLoaded && this.storedComID === currentComID && this.storedTenantID === currentTenantID) {
    console.log("Data is already loaded and comID and tenantID match");
    return of(true);
  }

  // If not loaded or comID/tenantID don't match, load data
  return forkJoin({
    products: this._productsService.GetProducts(0).pipe(defaultIfEmpty([])),
    locations: this._locationService.getAllLoc().pipe(defaultIfEmpty([])),
    customers: this._customerService.getAllCustomers().pipe(defaultIfEmpty([])),
    vendors: this._vendorService.getAllVendor().pipe(defaultIfEmpty([])),
    reportSettings: this._reportSettingService.GetInvoiceReportSettings().pipe(defaultIfEmpty([])),
    taxes: this._taxesService.getAllTaxes().pipe(defaultIfEmpty([])),
    config: this._appConfigService.GetConfigSettings().pipe(defaultIfEmpty([])),
    users : this._userService.getAllUsers().pipe(defaultIfEmpty([]))
  }).pipe(
    tap(result => {
      this.productsSubject.next(result.products || []);
      this.locationSubject.next(result.locations || []);
      this.customerSubject.next(result.customers || []);
      this.vendorSubject.next(result.vendors || []);
      this.reportSettingItemSubject.next(result.reportSettings || []);
      this.taxesSubject.next(result.taxes || []);
      this.configSettingSubject.next(result.config || []);
      this.usersSubject.next(result.users || []);

      this.isLoaded = true;
      this.storedComID = localStorage.getItem('comID');
      this.storedTenantID = localStorage.getItem('tenantID');
      })
    );
  }

   getProducts$(): Observable<ProductViewModel[]> {
    return this.productsSubject.asObservable();
  }

  getLocations$(): Observable<Location[]> {
    return this.locationSubject.asObservable();
  }

  getVendors$(): Observable<Vendor[]> {
    return this.vendorSubject.asObservable();
  }

  getCustomers$(): Observable<Customer[]> {
    return this.customerSubject.asObservable();
  }

  getReportSettings$(): Observable<InvoiceReportSettings[]> {
    return this.reportSettingItemSubject.asObservable();
  }

  getTaxes$(): Observable<Taxes[]> {
    return this.taxesSubject.asObservable();
  }

  getConfigSettings$(): Observable<ConfigSetting[]> {
    return this.configSettingSubject.asObservable();
  }

  getUsers$(): Observable<Users[]> {
    return this.usersSubject.asObservable();
  }

  updateConfigSettings$(data:ConfigSetting[]) {
    lastValueFrom(this._appConfigService.SaveConfigSetting(data));
    this.configSettingSubject.next(data);
  }
}
