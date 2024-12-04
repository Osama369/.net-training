import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Manage/Models/category';
import { CategoryService } from 'src/app/Manage/Services/category.service';
import { DepartmentService } from 'src/app/Manage/Services/department.service';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent {
  itemList: Category[];
  departments: any[] = []; // For storing department options
  categories: Category[] = []; // For storing parent category options

  @Output() dataEvent = new EventEmitter<any>();
  @Input() Data: any;
  @Input() DepartmentList: any;
  @Input() title: any;

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private departmentService: DepartmentService // Inject DepartmentService
  ) {}

  sendDataToParent() {
    this.dataEvent.emit({type:'closeGroup',value:false});
  }

  ngOnInit(): void {
    this.clear();
    this.loadDepartments();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadDepartments();
    this.loadCategories();

    if (this.Data != undefined && this.Data.length != 0) {
      this.itemList[0] = this.Data;
    } else {
      this.clear();
    }
  }

  clear(): void {
    this.itemList = [
      {
        categoryID: undefined,
        parentCategoryID: 0,
        parentCategoryName: undefined,
        depID: undefined,
        categoryName: undefined,
        descr: undefined,
        active: true,
        crtBy: undefined,
        crtDate: undefined,
        modby: undefined,
        modDate: undefined,
      },
    ];
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = (departments as { [key: string]: any })["enttityDataSource"];
      },
      error: (err) => {
        this.toastr.error('Error loading departments');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(result => {
      const allCategories = (result as { [key: string]: any })["enttityDataSource"];
      if (this.itemList[0].categoryID) {
        // Filter out the current category from the parent category dropdown
        this.categories = allCategories.filter(category => category.categoryID !== this.itemList[0].categoryID);
      } else {
        this.categories = allCategories;
      }
    });
  }

  saveProduct(): void {
    if (this.itemList[0].categoryName && this.itemList[0].depID) {
      this.categoryService.UpsertCategory(this.itemList[0]).subscribe({
        next: (prd) => {
          if(this.itemList[0].parentCategoryID != undefined){
            prd.parentCategoryName = this.categories.find(x=>x.categoryID == this.itemList[0].parentCategoryID).categoryName;
          }
          prd.depName = this.departments.find(x=>x.depID == this.itemList[0].depID).depName;

          this.loadCategories();
          if (this.title == "Category Registration") {
            this.toastr.success("Category has been successfully added!");
            this.dataEvent.emit({ type: 'added', value: prd });
          } else {
            this.toastr.success("Category has been successfully updated!");
            this.dataEvent.emit({ type: '', value: prd });
          }
        },
        error: (response) => {
          this.toastr.error(response.error);
          this.onEnterTableInput(-1);
        }
      });
    } else {
      this.toastr.error("Please complete all required fields.");
      this.onEnterTableInput(-1);
    }
  }

  onEnterTableInput(index: number): void {
    if (index < this.inputFieldsTableCst.length - 1) {
      this.focusOnTableInput(index + 1);
    } else {
      if (this.itemList[0].categoryName) {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      } else {
        this.toastr.error("Please write the Category Name.");
        this.onEnterTableInput(-1);
      }
    }
  }

  private focusOnTableInput(index: number): void {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }
}
