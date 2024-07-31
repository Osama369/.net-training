import { Injectable } from '@angular/core';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceFactoryService {
  constructor(
    private productService : ProductsService,
    private vendorService : VendorService,
    private customerService : CustomersService
    ) {}

  getService(serviceName: string): any | null {
    switch(serviceName) {
      case 'ProductService':
        return this.productService;
      case 'CustomerService':
        return this.customerService;
      case 'VendorService':
        return this.vendorService;
      default:
        return null;
    }
  }
}
