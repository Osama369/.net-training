export interface ProductViewModel {

  prodID?: number | null;
  prodGrpID?: number | null;
  prodCode?: string | null;
  shortName?: string | null;
  prodName?: any | null;
  descr?: string | null;
  prodUnit?: string | null;
  unitQty?: number | null;
  purchRate?: number | null;
  sellRate?: number | null;
  isTaxable?: boolean | null;
  isStore?: boolean | null;
  isRaw?: boolean | null;
  minQty?: number | null;
  maxQty?: number | null;
  mega?: string | null;
  active?: boolean | null;
  crtBy?: string | null;
  crtDate?: Date | null;
  modBy?: string | null;
  modDate?: Date | null;
  comID?: number | null;
  retailPrice?: number | null;
  tp?: number | null;
  isBonus?: boolean | null;
  isDiscount?: boolean | null;
  prodManuID?: number | null;
  depID?: number | null;
  categoryID?: number | null;
  isImported?: boolean | null;
  prodSize?: string | null;
  prodColor?: string | null;

  // ProductBarCodes Table Fields
  prodBCID?: number | null;
  barCode?: string | null;
  costPrice?: number | null;
  salePrice?: number | null;
  tradePrice?: number | null;
  unit?: string | null;
  fobPrice?: number | null;

  prodManuName?: string | null;
  depName?: string | null;
  categoryName?: string | null;
  prodGrpName?: string | null;

  lastCostPrice? : number | null;
  currentStock? : number | null;
  avgUnitPrice? : number | null;



  qty?: number;
  qtyBal?: number;
  discount?: number;
  bonusQty?: number;
  discountAmount?: number;
  discountPercent?: number;
  taxPercent?: number;
  taxAmount?: number;
  extraDiscountPercent?: number;
  extraDiscountAmount?: number;
  advanceTaxPercent?: number;
  advanceTaxAmount?: number;
  extraAdvanceTaxAmount?: number;
  extraAdvanceTaxPercent?: number;
  rebatePercent?: number;
  rebateAmount?: number;
  grossValue?: number;
  discountedGross?: number;
  netAmountBeforeRebate?: number;
  netAmount?: number;
  netRate?: number;
  amount?: string;
  batchNo?:string;
  notes?:string;
  expiryDate?:Date;
  prodInvoiceID?:number | 0;
}
