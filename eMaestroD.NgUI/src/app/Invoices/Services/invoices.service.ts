import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JournalVoucher } from 'src/app/Transaction/Models/journal-voucher';
import { Gl } from '../Models/gl';
import { InvoiceView } from '../Models/invoice-view';
import { Invoice } from '../Models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl + '/GL';
  ApiUrl: string = environment.BaseApiUrl + '/Invoice';

  constructor(private http: HttpClient) { }

  saveInvoice(data: Invoice): Observable<void> {
    return this.http.post<void>(this.ApiUrl + '/CreateInvoice', data);
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

  getInvoiceDetailByCustomer(cstID:Gl,prdID:Gl): Observable<Gl> {
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

  CheckIFInvoiceExist(cstID:any,prdID:any): Observable<any> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl + '/CheckIFInvoiceExist/'+cstID+'/'+prdID+'/'+comID);
  }
}

