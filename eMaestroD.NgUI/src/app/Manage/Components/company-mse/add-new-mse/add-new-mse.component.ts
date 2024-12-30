import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from 'src/app/Administration/Models/location';
import { CompanyCSE } from 'src/app/Manage/Models/company-cse';
import { Customer } from 'src/app/Manage/Models/customer';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CompanyCSEService } from 'src/app/Manage/Services/company-cse.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';


@Component({
  selector: 'app-add-new-mse',
  templateUrl: './add-new-mse.component.html',
  styleUrls: ['./add-new-mse.component.scss']
})
export class AddNewMSEComponent {
  @Input() companyCSE: any;  // This will receive the data from the parent
  @Input() title: string = ''; // Title of the dialog
  @Output() dataEvent = new EventEmitter<any>(); // Event emitter to send data back to parent
  customers:Customer[] = [];
  vendors:Vendor[] = [];
  filteredCustomers: Customer[] = []; // Customers available for the selected location
  selectedLocation: any; // Selected location
  selectedCustomer: any; // Selected customer
  locations: Location[] = []; // Available locations
  selectedLocationId: number | null = null;
  selectedCustomerId: number | null = null;
  isSaveDisable : boolean = false;
  constructor(private sharedDataService : SharedDataService, private toastr : ToastrService, private companyCSEService: CompanyCSEService) {}

  ngOnInit(): void {
    // Load locations and available customers for the first time (can be fetched from the backend)
    this.loadLocationsAndCustomers();
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(this.companyCSE);
    this.companyCSE.vendID = +this.companyCSE.vendID;
  }

  loadLocationsAndCustomers() {
    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
      }
    })

    this.sharedDataService.getCustomers$().subscribe({
      next: (cst) => {
        this.customers = [...(cst as { [key: string]: any })["enttityDataSource"]];
        }
    });


    
    this.sharedDataService.getVendors$().subscribe({
      next: (vnd) => {
        this.vendors = [...(vnd as { [key: string]: any })["enttityDataSource"]];
        }
    });
  }

  onLocationChange() {
    // Filter customers by selected location
    if (this.selectedLocationId) {
      this.filteredCustomers = this.customers.filter(
        (customer) => customer.cityID == this.selectedLocationId
      );
    } else {
      this.filteredCustomers = [];
    }
  }

  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
  }

  // Save the CompanyCSE data and send it to the parent
  saveCompanyCSE(): void {
    // Validate required fields
    if (!this.companyCSE.vendID) {
      this.toastr.error('Supplier is required.', 'Validation Error');
      return;
    }
  
    if (!this.companyCSE.RepName || this.companyCSE.RepName.trim() === '') {
      this.toastr.error('CSE Name is required.', 'Validation Error');
      return;
    }
  
    if (!this.companyCSE.Address1 || this.companyCSE.Address1.trim() === '') {
      this.toastr.error('Address is required.', 'Validation Error');
      return;
    }
  
    if (!this.companyCSE.email || this.companyCSE.email.trim() === '') {
      this.toastr.error('Email is required.', 'Validation Error');
      return;
    }
  
    if (!this.companyCSE.Cell || this.companyCSE.Cell.trim() === '') {
      this.toastr.error('Phone is required.', 'Validation Error');
      return;
    }
  
    if (!this.companyCSE.CSECustomer || this.companyCSE.CSECustomer.length === 0) {
      this.toastr.error('At least one customer must be added.', 'Validation Error');
      return;
    }
  
    this.isSaveDisable = true
    // Hit the save API
    this.companyCSE.compID = localStorage.getItem("comID");
    this.companyCSE.Active = true;
    this.companyCSEService.save(this.companyCSE).subscribe(
      (response:any) => {
        
        this.companyCSE.CSEID = response.CSEID;
        this.companyCSE.vendName = this.vendors.find(x=>x.vendID == this.companyCSE.vendID).vendName;
        this.toastr.success('Company CSE saved successfully.', 'Success');
        this.dataEvent.emit({ type: 'added', value: this.companyCSE });
        this.isSaveDisable = false;
      },
      (error) => {
        this.toastr.error('Failed to save Company CSE. Please try again.', 'Error');
        this.isSaveDisable = false;
      }
    );
  }

  // Cancel the operation and reset the form
  cancel(): void {
    this.companyCSE = {}; // Reset form if cancelled
  }

  // Add a new customer to the CSECustomer array
  addCustomerToLocation() {
    if (!this.selectedLocationId || !this.selectedCustomerId) return;

    // Get location and customer details
    const location = this.locations.find(
      (loc) => loc.LocationId == this.selectedLocationId
    );
    const customer = this.filteredCustomers.find(
      (cust) => cust.cstID == this.selectedCustomerId
    );

    if (!location || !customer) return;
    
    if (!this.companyCSE.CSECustomer) {
      this.companyCSE.CSECustomer = [];
    }
    // Check for duplicates
    const exists = this.companyCSE.CSECustomer.some(
      (entry) => entry.CstID == customer.cstID
    );

    if (exists) {
      this.toastr.error('Customer already added.');
      return;
    }

    // Add customer to the location
    this.companyCSE.CSECustomer.push({
      CstID: customer.cstID,
      CustomerName: customer.cstName,
      locationId: location.LocationId,
      LocationName: location.LocationName,
      Active : true
    });

    // Reset selections
    this.selectedCustomerId = null;
  }

  removeCustomerFromLocation(index: number) {
    this.companyCSE.CSECustomer.splice(index, 1);
  }


}
