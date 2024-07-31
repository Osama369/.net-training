import { ActivatedRoute, Params } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})

export class InvoicesComponent implements OnInit {
  @Input() voucherName : any;
  @Input() isBankInfo : any = false;
  @Input() isProductCode : any = false;
  @Input() isArabic : any = true;
  @Input() type : any;
  pdfUrl: SafeResourceUrl;
  myParam: string = "";
  serviceUrl: string = "";
  ssrsFilePath: string = "";
  baseApiUrl: string = environment.BaseApiUrl + '/Report';
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

// code until ...
  // ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     this.myParam = params['voucher'];
  //   });
  // this.serviceUrl = 'https://localhost:44395/reports/saleDelivery1?voucherNo=';
  // this.ssrsFilePath = this.myParam;
  // }

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   this.myParam = params['voucher'];
    // });
    let apiUrl = "";
    let comID  = localStorage.getItem('comID');

    const headers = new HttpHeaders({
      'isProductCode': this.isProductCode != null? this.isProductCode : "",
      'isArabic': this.isArabic != null? this.isArabic.toLocaleString() : "false",
    });
    const options = { headers: headers };

    if(this.type.toLowerCase() == "thermal")
    {
      apiUrl = this.baseApiUrl+'/PosReport/'+this.voucherName+'/'+this.isBankInfo+'/'+comID; // Replace with your actual API URL
    }
    else
    {
      apiUrl = this.baseApiUrl+'/PosA4Report/'+this.voucherName+'/'+this.isBankInfo+'/'+comID; // Replace with your actual API URL
    }
    this.http.get(apiUrl, {responseType: 'text', headers : headers},).subscribe(data => {
      //const pdfBlob = new Blob([data], { type: 'application/pdf' });
      //const url = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data);
    });

  }

}
