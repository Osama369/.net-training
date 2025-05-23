import { ProductDetail } from "./product-detail";

export interface RenderJson {
OrderDate?:any;
OrderNo?:any;
SupplierName?:any;
SupplierId?:any;
DeliveryAddress?:any;
totalAmount?:any;
fileURL? :any;
comID?:any;

ProductDetails?:ProductDetail[];

    Fax?: any;                          // Nullable, can be any type
    CustomerCode?: any;                 // Nullable, can be any type
    DeliveryNote?: any;                 // Nullable, can be any type
    DeliveryDate?: any;                 // Nullable, can be any type
    Tel?: any;                          // Nullable, can be any type
    Customer_Ref_No?: any;              // Nullable, can be any type
    InvNumber?: any;                    // Nullable, can be any type
    InvDate?: any;                      // Nullable, can be any type
    PhoneNo?: any;                      // Nullable, can be any type
    CustomerRefNo?: any;                // Nullable, can be any type
    DelNumber?: any;                    // Nullable, can be any type
    DelNote?: any;                      // Nullable, can be any type
    DelDate?: any;                      // Nullable, can be any type
    DelAddressLine1?: any;              // Nullable, can be any type
    DelAddressLine2?: any;              // Nullable, can be any type
    DelAddressLine3?: any;              // Nullable, can be any type
    DelSuburb?: any;                    // Nullable, can be any type
    DelState?: any;                     // Nullable, can be any type
    DelPostcode?: any;                  // Nullable, can be any type
    Remarks?: any;                      // Nullable, can be any type
    SalesOrderNo?: any;                 // Nullable, can be any type
    Terms?: any;                        // Nullable, can be any type
    Rep?: any;                          // Nullable, can be any type
    ShippedOn?: any;                    // Nullable, can be any type
    ShipVia?: any;                      // Nullable, can be any type
    FreightOnBoard?: any;               // Nullable, can be any type
    TotalCasesPallets?: any;            // Nullable, can be any type
    purchaseOrderNo?: any;              // Nullable, can be any type
    CompanyName?: any;
}
