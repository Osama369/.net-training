import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { Offer } from 'src/app/Manage/Models/offer';
import { OfferService } from 'src/app/Manage/Services/offer.service';


@Component({
  selector: 'app-add-new-offer',
  templateUrl: './add-new-offer.component.html',
  styleUrls: ['./add-new-offer.component.scss']
})
export class AddNewOfferComponent {
  itemList: Offer[];

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
    private router: Router,
    private productService:ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private offerService: OfferService
  ) {}

  clear()
  {
    this.itemList = [
      {
        offerID : undefined,
        offerName : undefined,
        active : true
      },
    ];
  }

  saveProduct()
  {
     if(this.itemList[0].offerName != "" && this.itemList[0].offerName != undefined)
     {

      this.offerService.upsertOffer(this.itemList[0]).subscribe({
        next: (prd) => {
          if(this.title == "Offer Registration")
          {
            this.toastr.success("Offer has been successfully added!");
            this.dataEvent.emit({type:'added',value:prd});
          }
          else
          {
            this.toastr.success("Offer has been successfully updated!");
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
      this.toastr.error("Please Write Offer Name.");
      this.onEnterTableInput(-1);
    }
  }



  onEnterTableInput(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.itemList[0].offerName != "" && this.itemList[0].offerName != undefined)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Offer Name.");
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
