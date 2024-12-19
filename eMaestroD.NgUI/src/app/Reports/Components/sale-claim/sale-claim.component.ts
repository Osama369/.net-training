
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { Products } from 'src/app/Manage/Models/products';


@Component({
  selector: 'app-sale-claim',
  templateUrl: './sale-claim.component.html',
  styleUrls: ['./sale-claim.component.scss']
})

export class SaleClaimComponent {
  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private sharedDataService: SharedDataService,
    private datePipe: DatePipe,
    private reportService: ReportService
  ) {}

  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom: any;
  DateTo: any;
  vendID: any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols: any[] = [];
  data: any[];
 
  bookmark: boolean = false;
 
  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.vendID = "434";

    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x => {
      this.bookmark = x;
    });

   
  }

  UpdateBookmark(value: any) {
    this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'], value).subscribe({
      next: (result: any) => {
        this.bookmark = value;
      },
    });
  }

  onEnterComplex(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInput(index + 1);
    }
  }

  private focusOnComplexInput(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const check = inputFieldARRAY[index - 1].el.nativeElement.tagName;
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
    inputField.focus();
    inputField.select();
  }

  submit() {
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 = this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith2Para("SaleClaimReport", d1, d2, 0,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}







