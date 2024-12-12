import { filter, empty, lastValueFrom } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/Manage/Models/products';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { Department } from 'src/app/Manage/Models/department';
import { ProdManufacture } from 'src/app/Manage/Models/prod-manufacture';
import { Category } from 'src/app/Manage/Models/category';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { TreeNode } from 'primeng/api';
import { ProdDiscount } from 'src/app/Manage/Models/prod-discount';
import { Offer } from 'src/app/Manage/Models/offer';
import { SchemesService } from 'src/app/Manage/Services/schemes.service';

@Component({
  selector: 'app-add-new-schemes',
  templateUrl: './add-new-schemes.component.html',
  styleUrls: ['./add-new-schemes.component.scss']
})
export class AddNewSchemesComponent {
  productGrouplist: prodGroups[];
  departmentList: Department[] = [];
  prodManufactureList: ProdManufacture[] = [];
  categoryList: Category[] = [];
  categoryListByDepartment: TreeNode[] = [];
  offerlist: Offer[];
  productlist: Products[] = [];
  filterProductlist: Products[] = [];

  schemesList: ProdDiscount[] = [{}];

  SelectedCategory : any = null;
  SelectedDepartment : any = null;
  SelectedBrand : any = null;
  SelectedManufacture : any = null;

  title : any = "Add Schemes & Promotion";
  isSaveDisable : boolean = false;
  hiddenField : boolean = true;
  autoComplete: any;
  EditProdDiscID:any;

  dtStart : any;
  dtEnd : any;
  offerID : any;
  schemeName : any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService:ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private genericService : GenericService,
    private AuthService : AuthService,
    private schemesService : SchemesService,
  ) {}

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  async ngOnInit(): Promise<void> {

    this.route.params.subscribe(params1 => {
      this.EditProdDiscID = params1['id'];
    });

    this.fetchAllDropdownData();
    var data = await lastValueFrom(this.productService.getAllProducts());
    this.productlist = (data as { [key: string]: any })["enttityDataSource"];
    console.log(this.productlist);
    if(this.EditProdDiscID)
    {
      //this.getEditProductDetail();
    }
  }

  async getEditProductDetail()
  {
    const data = await lastValueFrom(this.productService.GetOneProductDetail(this.EditProdDiscID));
    this.productlist[0] = data;
    this.onDepartmentChange(data.depID, data.categoryID);
  }

  async fetchAllDropdownData(): Promise<void> {
    try {
      const data = await lastValueFrom(this.genericService.getAllDropdownData());
      this.productGrouplist = data.ProductGroups;
      this.departmentList = data.Department;
      this.prodManufactureList = data.ProdManufacture;
      this.categoryList = data.Category;
      this.offerlist = data.Offer;

    } catch (error) {
      console.error('Error fetching dropdown data', error);
    }
  }

  onDepartmentChange(depID: number, categoryID: number) {
    // Filter the categoryList based on the selected depID
    this.categoryListByDepartment = this.buildCategoryTree(this.categoryList.filter(category => category.depID === depID)); //this.categoryList.filter(category => category.depID === depID);
    this.SelectedCategory = null;
    if(categoryID > 0)
      {
        const selectedCategory = this.findCategoryNode(this.categoryListByDepartment, categoryID);
        if (selectedCategory) {
          this.SelectedCategory = selectedCategory;
        }
      }
      this.GetFilteredProductList();
    //this.categoryListByDepartment = this.categoryList.filter(category => category.depID === depID);
  }


  GetFilteredProductList()
  {
      this.filterProductlist = this.productlist.filter(x =>
        (!this.SelectedDepartment?.depID || x.depID == this.SelectedDepartment.depID) &&
        (!this.SelectedCategory?.data?.categoryID || x.categoryID == this.SelectedCategory.data.categoryID) &&
        (!this.SelectedBrand?.prodGrpID || x.prodGrpID == this.SelectedBrand.prodGrpID) &&
        (!this.SelectedManufacture?.prodManuID || x.prodManuID == this.SelectedManufacture.prodManuID)
    );

    this.updateSchemeList();
  }

  updateSchemeList() {
    this.schemesList = [];
    // Example: filter schemes related to the products in the filtered list
    this.filterProductlist.forEach(product => {
      this.schemesList.push({
        prodID: product.prodID,
        prodDiscID: 0,
        offerID: null,
        comID: product.comID,
        descr: '',
        startQty: 0,
        maxQty: 0,
        maxAmount: 0,
        discount: 0,
        dtStart: null,
        dtEnd: null,
        active: true,
        crtBy: '',
        crtDate: new Date(),
        modBy: '',
        modDate: new Date(),
        cstID: 0
      });
    });
  }


   findCategoryNode(nodes: TreeNode[], categoryID: number): TreeNode | null {
    for (const node of nodes) {
        if (node.data.categoryID === categoryID) {
            return node;
        } else if (node.children && node.children.length > 0) {
            const foundNode = this.findCategoryNode(node.children, categoryID);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
  }



  prepareSchemesList() {
    // Loop through the schemesList to apply shared fields
    this.schemesList.forEach((item) => {
      item.dtStart = this.dtStart;
      item.dtEnd = this.dtEnd;
      item.offerID = this.offerID;
      item.descr = this.schemeName;
    });
  }


  saveSchemes()
  {

    let errorMessage = '';

    // Validate required fields
    if (!this.dtStart) {
      errorMessage += 'From Date is required.\n';
    }
    if (!this.dtEnd) {
      errorMessage += 'To Date is required.\n';
    }
    if (!this.offerID) {
      errorMessage += 'Scheme Type is required.\n';
    }
    if (!this.schemeName) {
      errorMessage += 'Scheme Name is required.\n';
    }

     // Show error message if validation fails
      if (errorMessage) {
        this.toastr.error(errorMessage);
        return;
      }

    this.prepareSchemesList();
    this.isSaveDisable = true;
    this.schemesService.saveSchemes(this.schemesList).subscribe({
      next: (prd:any) => {
        if(this.EditProdDiscID == undefined)
        {
          this.toastr.success("Scheme has been successfully added!");
        }
        else
        {
          this.toastr.success("Scheme has been successfully updated!");
        }
        this.router.navigateByUrl('/Manage/Schemes')
      },
      error: (response) => {
        console.log(response);
        this.toastr.error(response.error);
        this.onEnterTableInput(0);
        this.isSaveDisable = false;
      },
    });
  }

  count = 0;

  increaseFocusIndexForProducts()
  {
    this.count++;
  }


  onEnterTableInput(index: number) {
      if(index == -1 && this.count==0)
      {
        this.count++;
        return;
      }
      else
      {
        this.count = 0;
      }
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.productlist[0].prodName != "" && this.productlist[0].prodName != undefined
      )
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Product Name");
        this.count++;
        this.onEnterTableInput(0);
      }
    }

  }

  OnSaveFocus(){
    let el: HTMLElement = this.savebtn.nativeElement;
    el.focus();
  }

  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  close()
  {
    // this.productCom.ProductVisible = false;
    // this.purchaseCom.ProductsVisible = false;
    // this.saleCom.ProductsVisible = false;
    // this.quotationCom.ProductsVisible = false;
  }

  buildCategoryTree(categories: any[]): TreeNode[] {
    const categoryMap = new Map<number, TreeNode>();

    // Step 1: Create a map of categoryID to TreeNode
    categories.forEach(category => {
        categoryMap.set(category.categoryID, {
            label: category.categoryName,
            data: category,
            children: []
        });
    });

    const tree: TreeNode[] = [];

    // Step 2: Populate the tree structure
    categories.forEach(category => {
        const node = categoryMap.get(category.categoryID);
        if (category.parentCategoryID) {
            const parent = categoryMap.get(category.parentCategoryID);
            if (parent) {
                parent.children.push(node);
            }
        } else {
            tree.push(node);
        }
    });

    return tree;
  }

  sendDataToParent()
  {
    this.router.navigateByUrl('/Manage/Schemes');
  }
}
