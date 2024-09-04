import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProdManufacture } from 'src/app/Manage/Models/prod-manufacture';
import { ProdManufactureService } from 'src/app/Manage/Services/prod-manufacture.service';


@Component({
  selector: 'app-add-new-prod-manufacture',
  templateUrl: './add-new-prod-manufacture.component.html',
  styleUrls: ['./add-new-prod-manufacture.component.scss']
})
export class AddNewProdManufactureComponent {
  itemList: ProdManufacture[];

  @Output() dataEvent = new EventEmitter<any>();
  @Input() Data : any;
  @Input() title : any;
  sendDataToParent() {
    this.dataEvent.emit({type:'closeGroup',value:false});
  }

  OpenAddGroupByParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  ngOnInit(): void {

    this.clear();

  }

  ngOnChanges(changes: SimpleChanges) {



    if(this.Data != undefined && this.Data.length != 0)
    {
      this.itemList[0] = this.Data;
    }
    else
    {
      this.clear();
    }
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

}
  constructor(
    private toastr: ToastrService,
    private prodManufactureService: ProdManufactureService
  ) {}

  clear()
  {
    this.itemList = [
      {
       prodManuID : undefined,
       prodManuName : undefined
      },
    ];
  }

  saveProduct()
  {
     if(this.itemList[0].prodManuName != "" && this.itemList[0].prodManuName != undefined)
     {

      this.prodManufactureService.upsertProdManufacture(this.itemList[0]).subscribe({
        next: (prd) => {
          if(this.title == "Manufacture Registration")
          {
            this.toastr.success("Manufacture has been successfully added!");
            this.dataEvent.emit({type:'added',value:prd});
          }
          else
          {
            this.toastr.success("Manufacture has been successfully updated!");
            this.dataEvent.emit({type:'',value:prd});
          }
        },
        error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInput(-1);
        },
      });
    }
    else
    {
      this.toastr.error("Please Write Manufacture Name.");
      this.onEnterTableInput(-1);
    }
  }



  onEnterTableInput(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.itemList[0].prodManuName != "" && this.itemList[0].prodManuName != undefined)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Manufacture Name.");
        this.onEnterTableInput(-1);
      }
    }

  }
  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }
}
