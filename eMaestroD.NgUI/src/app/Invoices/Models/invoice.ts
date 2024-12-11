export interface Invoice {
  invoiceID?: number;
  invoiceDetailID? :number;
  invoiceDate?: Date;
  bookerID?:number;
  salesmanID?:number;
  invoiceVoucherNo?:any;
  invoiceType?:any;
  txtypeID?:number;
  CustomerOrVendorID?:number;
  customerOrVendorName?:string;
  fiscalYear? : number;
  comID?:number;
  locID?:number;
  grossTotal?: number;
  totalDiscount?: number;
  totalTax?: number;
  totalRebate?: number;
  totalExtraTax?: number;
  totalAdvanceExtraTax?: number;
  totalExtraDiscount?: number;
  netTotal?: number;
  notes?:string;
  convertedInvoiceNo?:any;
  isPaymented? : boolean;
  isApproved?:boolean;
  transactionStatus? : string;
  totalRemainingPayment?:number;
  Products?: InvoiceProduct[];
}


export interface InvoiceProduct {
  prodInvoiceID? :number;
  prodID?: number;
  prodBCID?: number;
  prodCode?: any;
  prodName?: any;
  descr?: any;
  unitQty?: number;
  qty?: number;
  bounsQty?: number;
  notes?:any;
  batchNo?:any;
  expiry?:any;
  purchRate?: number;
  sellRate?: number;
  discountPercent?: number;
  discountAmount?: number;
  extraDiscountPercent?: number;
  extraDiscountAmount?: number;
  rebatePercent?:number;
  rebateAmount?:number;
  grossValue?: number;
  netAmount?: number;
  mrp?:number;
  sellingPrice?:number;
  lastCost?:number;
  unit?:string;
  ProductTaxes? : InvoiceProductTax[];
}

export interface InvoiceProductTax
{
    taxDetailID?:number;
    taxAcctNo?:string;
    taxPercent?:number;
    taxAmount?:number;
}
