import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { VendorService } from './vendor.service';
import { CustomersService } from './customers.service';

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
