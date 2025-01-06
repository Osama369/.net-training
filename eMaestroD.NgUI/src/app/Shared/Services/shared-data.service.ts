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
      // this.productsSubject.next(result.products || []);
      this.setProducts(result.products || []);
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

  setProducts(rawProducts: any[]) {
    this.productsSubject.next(rawProducts);
    const currentData = (this.productsSubject.value as { [key: string]: any })["enttityDataSource"] || [];
    const updatedData = [...currentData];
    const transformedProducts = updatedData.reduce((acc: ProductViewModel[], product: any) => {
      const existingProduct = acc.find(p => p.prodID === product.prodID);

      if (existingProduct) {
        existingProduct.units.push({
          unitType: product.unit,
          unitValue: product.baseQty,
          unitId: product.prodBCID,
          unitCode: product.barCode,
        });
        existingProduct.unit = existingProduct.units
        .map(unit => `${unit.unitType}(${unit.unitValue})`)
        .join(', ');

        if (existingProduct.sellPrice === 0) {
          const nonZeroSellPrice = updatedData
            .filter(p => p.barCode === product.barCode && p.sellPrice !== 0)
            .map(p => p.sellPrice)[0];
          if (nonZeroSellPrice) {
            existingProduct.sellPrice = nonZeroSellPrice;
          }
        }
      } else {
        acc.push({
          ...product,
          sellPrice: product.sellPrice === 0
          ? updatedData.find(p => p.barCode === product.barCode && p.sellPrice !== 0)?.sellPrice || 0
          : product.sellPrice,
          units: [
            {
              unitType: product.unit,
              unitValue: product.baseQty,
              unitId: product.prodBCID,
              unitCode: product.barCode,
            },
          ],
        });
      }

      return acc;
    }, []);

    (this.productsSubject.value as { [key: string]: any })["enttityDataSource"] = transformedProducts;
    this.productsSubject.next(this.productsSubject.value);
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


  updateUsers$(): void {
    this._userService.getAllUsers().pipe(
      defaultIfEmpty([]),
      tap(users => {
        this.usersSubject.next(users || []);
      })
    ).subscribe();
  }


  updateTaxes$(data:Taxes) {
    const currentData = this.taxesSubject.value || [];
    const updatedData = [...currentData];

    const index = updatedData.findIndex(p => p.TaxID === data.TaxID);
    if (index >= 0) {
      updatedData[index] = data;
    } else {
      updatedData.push(data);
    }

    this.taxesSubject.next(updatedData);
  }

  updateReportSettings$(data:InvoiceReportSettings[]) {
    const currentData = this.reportSettingItemSubject.value || [];
    const updatedData = [...currentData];

    data.forEach(newItem => {
      const index = updatedData.findIndex(p => p.invoiceReportSettingID === newItem.invoiceReportSettingID);
      if (index >= 0) {
        updatedData[index] = newItem;
      } else {
        updatedData.push(newItem);
      }
    });

    this.reportSettingItemSubject.next(updatedData);
  }

  updateCustomers$(data:Customer) {
    const currentData = (this.customerSubject.value as { [key: string]: any })["enttityDataSource"] || [];
    const updatedData = [...currentData];
    console.log(data);
    const index = updatedData.findIndex(p => p.cstID === data.cstID);
    if (index >= 0) {
      updatedData[index] = data;
    } else {
      updatedData.push(data);
    }

   (this.customerSubject.value as { [key: string]: any })["enttityDataSource"] = updatedData;
    this.customerSubject.next(this.customerSubject.value);
   }

  updateVendors$(data:Vendor) {
    const currentData = (this.vendorSubject.value as { [key: string]: any })["enttityDataSource"] || [];
    const updatedData = [...currentData];

    const index = updatedData.findIndex(p => p.vendID === data.vendID);
    if (index >= 0) {
      updatedData[index] = data;
    } else {
      updatedData.push(data);
    }

   (this.vendorSubject.value as { [key: string]: any })["enttityDataSource"] = updatedData;
    this.vendorSubject.next(this.vendorSubject.value);
  }

  updateLocations$(data:Location) {
    console.log(data);
    const currentData = this.locationSubject.value || [];
    const updatedData = [...currentData];

    const index = updatedData.findIndex(p => p.LocationId === data.LocationId);
    if (index >= 0) {
      updatedData[index] = data;
    } else {
      updatedData.push(data);
    }

    this.locationSubject.next(updatedData);
  }


  updateProducts$(data: ProductViewModel[]) {
    const currentData = (this.productsSubject.value as { [key: string]: any })["enttityDataSource"] || [];
    const updatedData = [...currentData];

    data.forEach(product => {
      var existingProduct = updatedData.find(p => p.barCode === product.barCode);
      var UdpatedIndex= updatedData.findIndex(p => p.barCode === product.barCode);

      const newUnit = {
        unitType: product.unit,
        unitValue: product.baseQty,
        unitId: product.prodBCID,
        unitCode: product.barCode,
       
      };

      if (existingProduct) {
        const index = existingProduct.units.findIndex(unit => unit.unitId === newUnit.unitId);
        if (index === -1) {
          existingProduct.units.push(newUnit);
        

        } else {
          existingProduct.units[index] = newUnit;
        
        }
        existingProduct.unit = existingProduct.units
        .map(unit => `${unit.unitType}(${unit.unitValue})`)
        .join(', ');
        Object.assign(existingProduct, {
          ...product, // Update fields from the new product
          units: existingProduct.units, // Retain updated units
          unit: existingProduct.unit,   // Retain updated unit string
        });
      } else {
        // Add a new product entry
        updatedData.unshift({
          ...product,
          units: [newUnit],
          unit: `${newUnit.unitType}(${newUnit.unitValue})`, // Initialize unit string
        });
      }
    });

    // Update the enttityDataSource and notify observers
    (this.productsSubject.value as { [key: string]: any })["enttityDataSource"] = updatedData;
    this.productsSubject.next(this.productsSubject.value);
  }

}
