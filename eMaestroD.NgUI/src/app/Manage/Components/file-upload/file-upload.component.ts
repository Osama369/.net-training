import { Component, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Toast, ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ApiServiceFactoryService } from 'src/app/Shared/Services/api-service-factory.service';
import { ProductsService } from '../../Services/products.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [MessageService]
})
export class FileUploadComponent {
  @Input() public uploadHeading: string = 'No Heading';
  @Input() public data: any[] = [];
  @Input() public serviceName: any;
  @Input() public methodName: any;
  @Input() public confirmCategory: boolean = false;
  uploadedFiles: any[] = [];
  @Output() dataEvent = new EventEmitter<any>();
  @ViewChild('file') fileUpload: any;
  UploadBtnDisable : boolean = false;
  private ApiService : any
  ProductGroupVisible : boolean  = false;
  prodCategoryList : any[];
  confirm : boolean = false;

  constructor(private toastr : ToastrService,
    private apiServiceFactory : ApiServiceFactoryService,
    private productService : ProductsService,
    ) {}

    ngOnChanges(change:SimpleChange):void{
      this.confirm = this.confirmCategory;
    }

  onUpload() {

    if(this.confirm)
    {
      this.UploadBtnDisable = true;
      const formData = new FormData();
      formData.append('file', this.fileUpload.files[0]);
      this.productService.confirmProductCategory(formData).subscribe({
        next:(data:any)=>{
            this.ProductGroupVisible = true;
            this.prodCategoryList = data;
        },
        error:(response:any)=>{
          this.confirm = false;
          this.onUpload();
        }
      })
    }
    else
    {

      this.UploadBtnDisable = true;
      const formData = new FormData();
      formData.append('file', this.fileUpload.files[0]);
      this.toastr.info("File is uploading Please Wait!", "", { timeOut: 2000000 });
      const serviceInstance = this.apiServiceFactory.getService(this.serviceName);
        serviceInstance[this.methodName](formData).subscribe({
          next: (data:any) => {
            this.dataEvent.emit(data);
            this.toastr.clear();
            this.fileUpload.clear();
            this.toastr.show(data[0].comment, "", { timeOut: 20000 });
            this.UploadBtnDisable = false;
          },
          error: (response:any) => {
            this.toastr.clear();
            this.toastr.error(response.error);
            this.UploadBtnDisable = false;
          },
        });
    }
  }


  downloadTemplate()
  {
    this.exportExcel();
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.data);
        const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, this.uploadHeading.toString());
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  handleChildData(data: any) {
    if(data.value){
        this.confirm = false;
        this.onUpload();
    }
    this.UploadBtnDisable = false;
    this.ProductGroupVisible = false;
  }

  closeConfirmCategoryDailog()
  {
    this.UploadBtnDisable = false;
  }
}
