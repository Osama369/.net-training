export interface Products {
    prodID ?: any;
    prodGrpID ?: any;
    comID ?: any;
    comName ?: any;
    prodGrpName ?: any;
    prodCode ?: any;
    shortName ?: any;
    prodName ?: any;
    descr ?: any;
    prodUnit ?: any;
    unitQty ?: any;
    qty?:any;
    tax?:any;
    discount?:any;
    purchRate ?: any;
    amount?:any;
    sellRate ?: any;
    batch?:any;
    retailprice ?: any;
    bonusQty?:any;
    tP ?: any;
    qtyBal?:any;
    isDiscount ?: any;
    isTaxable ?: any;
    isStore ?: any;
    isRaw ?: any;
    isBonus ?: any;
    minQty ?: any;
    maxQty ?: any;
    mega ?: any;
    active ?: any;
    crtBy ?: any;
    crtDate ?: any;
    modby ?: any;
    modDate ?: any;
    expirydate ?: any;
    GLID ?: any;
    TxID ?: any;
    unitPrice ?: any;
    taxName?:any;
    barcodeImage?:any;
    vendID?:any;
    vendName?:any;
    productBarCodes?: ProductBarCodes[];
}


export class ProductBarCodes {
  prodBCID?: number;
  prodID?: number;
  BarCode?: string;
  Qty?: number;
  Unit?: string;
  Active?: boolean;
}
