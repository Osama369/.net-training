import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JournalVoucher } from 'src/app/Transaction/Models/journal-voucher';
import { Gl } from '../Models/gl';
import { InvoiceView } from '../Models/invoice-view';
import { Invoice, InvoiceProduct, InvoiceProductTax } from '../Models/invoice';
import { Products } from 'src/app/Manage/Models/products';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl + '/GL';
  ApiUrl: string = environment.BaseApiUrl + '/Invoice';

  constructor(private http: HttpClient) { }

  SaveInvoice(data: Invoice): Observable<void> {
    return this.http.post<void>(this.ApiUrl + '/CreateInvoice', data);
  }

  GetInvoice(voucherNo:string): Observable<Invoice> {
    return this.http.get<Invoice>(this.ApiUrl + '/GetInvoice/'+voucherNo);
  }

  GetSaleInvoice(voucherNo:string): Observable<Invoice> {
    return this.http.get<Invoice>(this.ApiUrl + '/GetSaleInvoice/'+voucherNo);
  }

  GetInvoiceRemainingAmount(voucherNo:string): Observable<number> {
    return this.http.get<number>(this.ApiUrl + '/GetInvoiceRemainingAmount/'+voucherNo);
  }

  GetInvoiceDetailBy(voucherNo:string): Observable<Invoice> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Invoice>(this.ApiUrl + '/GetInvoice/'+voucherNo);
  }

  GetProductBatchByProdBCID(prodID:number, prodBCID:number,locID:number): Observable<InvoiceProduct[]>{
    let comID = localStorage.getItem('comID');
    return this.http.get<InvoiceProduct[]>(this.ApiUrl + '/GetProductBatchByProdBCID/'+prodID+'/'+prodBCID+'/'+locID+'/'+comID);
  }

  GetItemsBySupplierAndDate(supplierId: string, fromDate: any, ToDate: any): Observable<InvoiceProduct[]> {
    return this.http.get<InvoiceProduct[]>(`${this.ApiUrl}/GetItemsBySupplierAndDate/${supplierId}/${fromDate}/${ToDate}`);
  }


  GetInvoices(txtypeID:number,customerOrVendorID:number): Observable<Invoice[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Invoice[]>(this.ApiUrl + '/GetInvoices/'+txtypeID+'/'+customerOrVendorID+'/'+comID);
  }

  ApproveInvoice(voucherNo:string)
  {
    let comID = localStorage.getItem('comID');
    return this.http.get<void>(this.ApiUrl + '/ApproveInvoice/'+voucherNo+'/'+comID);
  }


  PostInvoices(invoces:Invoice[])
  {
    return this.http.post<void>(this.ApiUrl + '/PostInvoices/',invoces);
  }



  DeleteInvoice(voucherNo:string)
  {
    let comID = localStorage.getItem('comID');
    return this.http.delete<void>(this.ApiUrl + '/DeleteInvoice/'+voucherNo+'/'+comID);
  }

  saveSaleInvoice(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddSaleInvoice', newInvoice);
  }

  SaveStockAdjustment(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/SaveStockAdjustment', newInvoice);
  }

  UploadStockAdjustment(formData:any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<any>(this.baseApiUrl + '/UploadStockAdjustment/', formData, options);
  }

  saveSaleReturn(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddSaleReturn', newInvoice);
  }

  saveServiceInvoice(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddServiceInvoice', newInvoice);
  }

  savePurchaseInvoice(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddPurchaseInvoice', newInvoice);
  }

  savePurchaseReturn(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddPurchaseReturn', newInvoice);
  }

  savePurchaseOrder(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddPurchaseOrder', newInvoice);
  }

  saveQuotationInvoice(newInvoice: Gl[]): Observable<Gl[]> {
    return this.http.post<Gl[]>(this.baseApiUrl + '/AddQuotationInvoice', newInvoice);
  }

  saveReceiptVoucher(newInvoice: InvoiceView[]): Observable<InvoiceView[]> {
    return this.http.post<InvoiceView[]>(this.baseApiUrl + '/saveReceiptVoucher', newInvoice);
  }

  saveJournalVoucher(newInvoice: JournalVoucher[]): Observable<JournalVoucher[]> {
    return this.http.post<JournalVoucher[]>(this.baseApiUrl + '/saveJournalVoucher', newInvoice);
  }

  SaveExpenseVoucher(newInvoice: JournalVoucher[]): Observable<JournalVoucher[]> {
    return this.http.post<JournalVoucher[]>(this.baseApiUrl + '/SaveExpenseVoucher', newInvoice);
  }

  savePaymentVoucher(newInvoice: InvoiceView[]): Observable<InvoiceView[]> {
    return this.http.post<InvoiceView[]>(this.baseApiUrl + '/savePaymentVoucher', newInvoice);
  }

  getInvoiceDetailByCustomer(cstID:any,prdID:any): Observable<Gl> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Gl>(this.baseApiUrl + '/getInvoiceDetailByCustomer/'+cstID+'/'+prdID+'/'+comID);
  }

  getInvoicesList(txTypeID:any): Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getInvoicesList/'+txTypeID+'/'+comID);
  }

  getInvoicesListByCustomer(txTypeID:any,cstID:any): Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getInvoicesListByCustomer/'+txTypeID+'/'+cstID+'/'+comID);
  }

  GetInvoicesListByID(txTypeID:any,cstID:any): Observable<Gl[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Gl[]>(this.baseApiUrl + '/GetInvoicesListByID/'+txTypeID+'/'+cstID+'/'+comID);
  }

  getOneInvoiceDetail(invoiceNo:any): Observable<Gl[]> {
    return this.http.get<Gl[]>(this.baseApiUrl + '/getOneInvoiceDetail/'+invoiceNo);
  }

  getOneVoucherDetail(invoiceNo:any): Observable<InvoiceView[]> {
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getOneVoucherDetail/'+invoiceNo);
  }

  getPaymentDetail(invoiceNo:any): Observable<InvoiceView[]> {
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getPaymentDetail/'+invoiceNo);
  }


  getCashPaymentDetail(invoiceNo:any): Observable<InvoiceView[]> {
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getCashPaymentDetail/'+invoiceNo);
  }


  GetReturnDetail(invoiceNo:any): Observable<Gl[]> {
    return this.http.get<Gl[]>(this.baseApiUrl + '/GetReturnDetail/'+invoiceNo);
  }

  getVoucherDetail(invoiceNo:any): Observable<InvoiceView[]> {
    return this.http.get<InvoiceView[]>(this.baseApiUrl + '/getVoucherDetail/'+invoiceNo);
  }

  getJournalVoucherDetail(invoiceNo:any): Observable<JournalVoucher[]> {
    return this.http.get<JournalVoucher[]>(this.baseApiUrl + '/getJournalVoucherDetail/'+invoiceNo);
  }

  deleteInvoice(invoiceNo:any): Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.delete<InvoiceView[]>(this.baseApiUrl + '/deleteInvoice/'+invoiceNo+'/'+comID);
  }

  deleteInvoiceRow(GLID:InvoiceView[]): Observable<InvoiceView[]> {
    return this.http.post<InvoiceView[]>(this.baseApiUrl + '/deleteInvoiceRow',GLID);
  }

  deleteReceiptVoucher(ReceiptNo:any) :Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.delete<InvoiceView[]>(this.baseApiUrl + '/deleteReceipt/'+ReceiptNo+'/'+comID);
  }

  deletePaymentVoucher(VoucherNo:any) :Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.delete<InvoiceView[]>(this.baseApiUrl + '/deletePayment/'+VoucherNo+'/'+comID);
  }

  deleteJournalVoucher(VoucherNo:any) :Observable<InvoiceView[]> {
    let comID = localStorage.getItem('comID');
    return this.http.delete<InvoiceView[]>(this.baseApiUrl + '/deleteJournal/'+VoucherNo+'/'+comID);
  }

  CheckIFInvoiceExist(cstID:any,prodBCID:any): Observable<any> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl + '/CheckIFInvoiceExist/'+cstID+'/'+prodBCID+'/'+comID);
  }



    createInvoice(invoiceID:number,invoiceDetailID:number,fiscalYear:number,voucherNo: string, selectedType: any[], txTypeID: number, CustomerOrVendorID: any, selectedLocation: any, productList: ProductViewModel[], totalGross: number, totalDiscount: number, totalTax: number, totalRebate: number, totalExtraTax: number, totalAdvanceExtraTax: number, totalExtraDiscount: number, totalNetPayable: number, taxesList: any[], convertedInvoice : string, bookerID? : number, salesmanID? : number): Invoice {
    return {
      invoiceID: invoiceID,
      invoiceDetailID : invoiceDetailID,
      fiscalYear : fiscalYear,
      invoiceDate: new Date(),
      invoiceVoucherNo: voucherNo,
      invoiceType : selectedType[0].name,
      txtypeID: txTypeID,
      CustomerOrVendorID: CustomerOrVendorID,
      comID: parseInt(localStorage.getItem('comID')!),
      locID: selectedLocation?.LocationId,
      bookerID : bookerID || 0,
      salesmanID : salesmanID || 0,
      grossTotal: totalGross,
      totalDiscount: totalDiscount,
      totalTax: totalTax,
      totalRebate: totalRebate || 0,
      totalExtraTax: totalExtraTax || 0,
      totalAdvanceExtraTax: totalAdvanceExtraTax || 0,
      totalExtraDiscount: totalExtraDiscount || 0,
      netTotal: totalNetPayable,
      convertedInvoiceNo : convertedInvoice,
      Products: productList.filter(p => p.prodID > 0).map(p => this.createInvoiceProduct(p, taxesList))
    };
  }

  createInvoiceProduct(product: ProductViewModel, taxesList: any[]): InvoiceProduct {
    const expiryDateString = product.expiryDate;
    const expiryDate = "";
    if(expiryDateString)
    {
      const [day, month, year] = expiryDateString.split('-').map(Number);
      const expiryDate = new Date(year, month - 1, day);
    }
    return {
      prodInvoiceID : product.prodInvoiceID,
      prodID: product.prodID,
      prodBCID: product.unit.unitId,
      prodCode: product.prodCode,
      prodName: product.prodName.prodName,
      descr: product.descr,
      unitQty: product.unitQty,
      qty: product.qty * product.unit?.unitValue,
      bounsQty: product.bonusQty,
      notes: product.notes,
      batchNo: product.batchNo,
      expiry: expiryDate,
      purchRate: product.purchRate / product.unit?.unitValue,
      sellRate: product.sellRate / product.unit?.unitValue,
      discountPercent: product.discount,
      discountAmount: product.discountAmount,
      extraDiscountPercent: product.extraDiscountPercent,
      extraDiscountAmount: product.extraDiscountAmount,
      rebatePercent: product.rebatePercent,
      rebateAmount: product.rebateAmount,
      grossValue: product.grossValue,
      netAmount: product.netAmount,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      lastCost : product.lastCost,
      ProductTaxes: this.createProductTaxes(product, taxesList)
    };
  }

  createProductTaxes(product: ProductViewModel, taxesList: any[]): InvoiceProductTax[] {
    return [
      {
        taxDetailID : product.taxID,
        taxAcctNo: taxesList[0].acctNo,
        taxPercent: product.taxPercent,
        taxAmount: product.taxAmount
      },
      {
        taxDetailID:product.advanceTaxID,
        taxAcctNo: taxesList[1].acctNo,
        taxPercent: product.advanceTaxPercent,
        taxAmount: product.advanceTaxAmount
      },
      {
        taxDetailID: product.extraAdvanceTaxID,
        taxAcctNo: taxesList[2].acctNo,
        taxPercent: product.extraAdvanceTaxPercent,
        taxAmount: product.extraAdvanceTaxAmount
      }
    ];
  }

}

