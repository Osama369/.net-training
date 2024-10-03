export interface Invoice {
  invoiceID?: number;
  invoiceDate?: Date;
  invoiceVoucherNo?:any;
  invoiceType?:any;
  txtypeID?:number;
  vendID?:number;
  cstID?:number;
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
  Products?: InvoiceProduct[];
}


export interface InvoiceProduct {
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

  ProductTaxes? : InvoiceProductTax[];
}

export interface InvoiceProductTax
{
    taxAcctNo?:string;
    taxPercent?:number;
    taxAmount?:number;
}
