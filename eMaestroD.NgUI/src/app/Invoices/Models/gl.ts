export interface Gl {

    // GLID?: any;
    // txID ?: 0;
    // relTxID ?: 0;
    // relacctName ?: "";
    // acctName ?: "";
    // relCOAID ?: 0;
    // postTypeID ?: 0;
    // journalID ?: 0;
    // txTypeID ?: any;
    // invoiceID ?: 0;
    // depositID ?: 0;
    // salesManID ?: 0;
    // bookerID ?: 0;
    // locID ?: 0;
    // locName ?: "";
    // empID ?: 0;
    // empFName ?: "";
    // empLName ?: "";
    // cstID ?: 0;
    // cstName ?: "";
    // vendID ?: 0;
    // vendName ?: "";
    // prodID ?: 0;
    // prodName ?: "";
    // prodUnit ?: "";
    // prodCode ?: "";
    // sellRate ?: 0;
    // purchRate ?: 0;
    // avgTp ?: 0;
    // comPrice ?: 0;
    // comID ?: 0;
    // CompanyName ?: "";
    // prodGrpID ?: 0;
    // ProdCategorey ?: "";
    // qty ?: 0;
    // qtyBal ?: 0;
    // unitPrice ?: 0;
    // bonusQty ?: 0;
    // bonusSum ?: 0;
    // instituteOffer ?: 0;
    // creditOffer ?: 0;
    // tradeOffer ?: 0;
    // acctBal ?: 0;
    // balSum ?: 0;
    // creditSum ?: 0;
    // debitSum ?: 0;
    // discountSum ?: 0;
    // paidSum ?: 0;
    // taxSum ?: 0;
    // unusedSum ?: 0;
    // voidedSum ?: 0;
    // dtTx ?: Date;
    // dtDue ?: Date;
    // glComments ?: "";
    // isCleared ?: any;
    // isDeposited ?: any;
    // isPaid ?: any;
    // isVoided ?: any;
    // checkName ?: "";
    // batchNo ?: any;
    // expiry ?: Date;
    // claim ?: 0;
    // checkAdd ?: "";
    // checkNo ?: "";
    // voucherID ?: "";
    // voucherNo ?: any;
    // active ?: true;
    // crtBy ?: "";
    // crtDate ?: Date;
    // modBy ?: "";
    // modDate ?: Date;
    // dtStart ?: Date;
    // dtEnd ?: Date;
    GLID?: any;
    txID?: any;
    txTypeID ?: any,
    prodName ?: any,
    cstName ?: any,
    locID?:any,
    expiry?:any,
    dtDue?:any,
    cstID ?: any,
    isDeposited ?: any,
    isVoided ?: any,
    isCleared ?: any,
    isPaid ?: any,
    voucherNo ?: any,
    creditSum ?: any,
    discountSum ?: any,
    taxSum ?: any,
    paidSum ?: any,
    dtTx ?: any,
    empID ?: any,
    glComments ?: any,
    crtBy ?: any,
    prodID ?: any,
    batchNo ?: any,
    qty?:any,
    bonusQty?:any,
    unitPrice?:any,
    depositID?:any,
    modBy?:any,
    checkName?:any,
    active?:any,
    COAID ?: any;
    coaid ?: any;
    type?:any;
    purchRate?:any;
    crtDate ?: any;
    relCOAID?: any;
    vendID ?: any;
    prodCode?: any;
    debitSum?: any;
    taxName?:any;
    comID?:any;
    qtyBal?: any;
    balSum?:any;
    checkNo?:any;
    checkAdd?:any;
    acctNo?:any;
}

export interface type{
    name?:any;
}
