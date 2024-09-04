import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Companies } from 'src/app/Administration/Models/companies';
import { Products } from 'src/app/Manage/Models/products';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { Department } from 'src/app/Manage/Models/department';
import { DepartmentService } from 'src/app/Manage/Services/department.service';


@Component({
  selector: 'app-add-new-department',
  templateUrl: './add-new-department.component.html',
  styleUrls: ['./add-new-department.component.scss']
})
export class AddNewDepartmentComponent {
  itemList: Department[];

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
    private departmentService: DepartmentService
  ) {}

  clear()
  {
    this.itemList = [
      {
        depID : undefined,
        depName : undefined,
        descr : undefined
      },
    ];
  }

  saveProduct()
  {
     if(this.itemList[0].depName != "" && this.itemList[0].depName != undefined)
     {

      this.departmentService.upsertDepartment(this.itemList[0]).subscribe({
        next: (prd) => {
          if(this.title == "Department Registration")
          {
            this.toastr.success("Department has been successfully added!");
            this.dataEvent.emit({type:'added',value:prd});
          }
          else
          {
            this.toastr.success("Department has been successfully updated!");
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
      this.toastr.error("Please Write Department Name.");
      this.onEnterTableInput(-1);
    }
  }



  onEnterTableInput(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.itemList[0].depName != "" && this.itemList[0].depName != undefined)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Department Name.");
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
