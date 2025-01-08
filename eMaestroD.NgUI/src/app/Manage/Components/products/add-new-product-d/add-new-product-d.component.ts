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
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';

@Component({
  selector: 'app-add-new-product-d',
  templateUrl: './add-new-product-d.component.html',
  styleUrls: ['./add-new-product-d.component.scss']
})
export class AddNewProductDComponent {

 
  productGrouplist: prodGroups[];
  Supplierlist: Vendor[] =  [];
  departmentList: Department[] = [];
  prodManufactureList: ProdManufacture[] = [];
  categoryList: Category[] = [];
  categoryListByDepartment: TreeNode[] = [];

  productlist: Products[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;
  SelectedSupplier: any = null;
  filteredSuppliers: any[] = []; // Stores filtered results
  SelectedCategory : any = null;
  comName: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() prodData : any;
  @Input() title : any;
  @Input() prodGroupData : any;
  @Input() showGroupBtn : boolean = false;
  SupplierVisible : boolean = false;
  departmentVisible : boolean = false;
  categoryVisible : boolean = false;
  manufactureVisible : boolean = false;
  brandVisible : boolean = false;
  savebtnDisable : boolean = false;

  selectedType : any;
  filterType : any;
  hiddenField : boolean = true;
  type :any[] = [ 'Goods','Service'];
  autoComplete: any;
  unitOptions = [
    { label: 'Unit', value: 'Unit' },
    { label: 'Pack', value: 'Pack' },
    { label: 'Carton', value: 'Carton' }
  ];
  EditProdID:any;

  isPos : boolean = localStorage.getItem("isPos") === 'true';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService:ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private sharedDataService: SharedDataService,
    private genericService : GenericService,
    private AuthService : AuthService,
    private zone: NgZone
  ) {}


  sendDataToParent() {
    this.router.navigateByUrl('/Manage/Products')
    // this.dataEvent.emit({type:'',value:false});
  }

  OpenAddGroupByParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  async ngOnInit(): Promise<void> {

    this.route.params.subscribe(params1 => {
      this.EditProdID = params1['id'];
   });


   console.log(this.EditProdID);

    this.selectedType = this.type[0];

    this.filterType = this.type;
    await this.fetchAllDropdownData();
    if(this.EditProdID)
    {
      this.getEditProductDetail();
    }

  }

  async getEditProductDetail()
  {
    const data = await lastValueFrom(this.productService.GetOneProductDetail(this.EditProdID));
      this.productlist[0] = data;
      console.log(this.productlist[0]);
      this.SelectedSupplier = this.Supplierlist.find(x=>x.vendID == this.productlist[0].vendID);
      this.onDepartmentChange(data.depID, data.categoryID);
  }

  async fetchAllDropdownData(): Promise<void> {
    try {
      const data = await lastValueFrom(this.genericService.getAllDropdownData());
      this.productGrouplist = data.ProductGroups;
      this.departmentList = data.Department;
      this.prodManufactureList = data.ProdManufacture;
      this.categoryList = data.Category;
      this.categoryListByDepartment = this.buildCategoryTree(this.categoryList);

      this.productlist[0].ProductBarCodes?.push({ prodBCID : 0, prodID: this.productlist[0].prodID, BarCode: this.productlist[0].prodCode, Unit: 'Unit', Qty: 1, Active: true, isEditable : true})
      this.productlist[0].isTaxable = true;

      this.sharedDataService.getVendors$().subscribe(vnd => {
        this.Supplierlist = (vnd as { [key: string]: any })["enttityDataSource"];
      });


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
    //this.categoryListByDepartment = this.categoryList.filter(category => category.depID === depID);
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
  hideFields()
  {
    if(this.selectedType == "Service")
    {
      this.hiddenField = false;
    }
    else
    {
      this.hiddenField = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {

    if(this.prodGroupData != undefined)
    {
      this.productGrouplist.push(this.prodGroupData);
      this.SelectedproductGrouplist = {prodGrpID:this.prodGroupData.prodGrpID,prodGrpName:this.prodGroupData.prodGrpName};
    }

    if(this.prodData != undefined && this.prodData.length != 0)
    {
      this.productlist[0] = this.prodData;
      console.log(this.productlist[0]);
      this.selectedType = this.prodData.descr;
      this.hideFields();
      this.SelectedproductGrouplist = {prodGrpID:this.productlist[0].prodGrpID,prodGrpName:this.productGrouplist.find(x=>x.prodGrpID==this.productlist[0].prodGrpID)?.prodGrpName};
    }
    else
    {
      this.clear();
    }
}


selectedProducts: any;

addNewRow() {
  if(this.productlist[0].ProductBarCodes?.find(x=>x.BarCode == "" || x.Qty === 0 || x.Unit == "" )){
    this.toastr.info("Please Fill Empty row first to add new row!");
  }else{
    this.productlist[0].ProductBarCodes?.push({ prodBCID : 0, prodID: this.productlist[0].prodID, BarCode: "", Unit: '', Qty: 0, Active: true})
  }
}

removeRow(productbarcode: any) {
  if (this.productlist[0]?.ProductBarCodes) {
    const index = this.productlist[0].ProductBarCodes.indexOf(productbarcode);
    if (index !== -1) {
      this.productlist[0].ProductBarCodes.splice(index, 1);
    }
  }
}

onQtyChange(product: any) {
  // Check if the new quantity already exists in the ProductBarCodes list
  const isDuplicate = this.productlist[0]?.ProductBarCodes.some(
    (p: any) => p !== product && p.Qty === product.Qty
  );

  if (isDuplicate) {
    this.toastr.error('Quantity must be unique across all barcodes.');
    product.Qty = 0; // Reset the value if duplicate

    return;
  }
}

onUnitChange(product: any) {
  // Check if the new quantity already exists in the ProductBarCodes list
  const isDuplicate = this.productlist[0]?.ProductBarCodes.some(
    (p: any) => p !== product && p.Unit === product.Unit
  );

  if (isDuplicate) {
    this.toastr.error('Unit must be unique across all barcodes.');
    product.Unit = ""; // Reset the value if duplicate

    return;
  }
}

onRowEditSave(product:any) {
  // Save logic here
}

onRowEditCancel(product:any, editing:any) {
  // Cancel logic here
}


  filterProduct(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.productGrouplist.length; i++) {
      let product = this.productGrouplist[i];
      if (product.prodGrpName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterProductGrouplist = filtered;
  }

  filtersType(event:any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.type.length; i++) {
      let type = this.type[i];
      if (type.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filterType = filtered;
  }

  clear()
  {
    this.SelectedSupplier = null;
    this.SelectedCategory = null;
    this.productlist = [
      {
        prodID : undefined,
        prodGrpID : undefined,
        comID : undefined,
        comName : undefined,
        prodGrpName : undefined,
        prodCode : undefined,
        shortName : undefined,
        prodName : undefined,
        descr : undefined,
        prodUnit : "pcs",
        unitQty : undefined,
        qty:undefined,
        tax:undefined,
        discount:undefined,
        purchRate : undefined,
        amount:undefined,
        sellRate : undefined,
        batch:undefined,
        retailprice : undefined,
        bonusQty:undefined,
        tP : undefined,
        isDiscount : false,
        isTaxable : true,
        isStore : false,
        isRaw : false,
        isBonus : false,
        minQty : undefined,
        maxQty : undefined,
        mega : true,
        active : true,
        crtBy : undefined,
        crtDate : undefined,
        modby : undefined,
        modDate : undefined,
        expirydate : undefined,
        qtyBal:undefined,
        GLID:undefined,
        TxID:undefined,
        unitPrice:undefined,
        vendID:undefined,
        ProductBarCodes: [
          // {BarCode: '', Unit: 'pcs', Qty: 1, Active: true}
        ]
      },
    ];
  }

  saveProduct()
  {

    if(!this.isPos && this.productlist[0].vendID == undefined)
    {
      this.toastr.error("Please write Select Supplier.");
      this.onEnterTableInput(-1);
      return;
    }

    if(this.SelectedCategory != null)
    {
      this.productlist[0].categoryID = this.SelectedCategory.data.categoryID;
      console.log(this.SelectedCategory);
      console.log(this.productlist[0].categoryID);
    }

    if(this.productlist[0].prodCode == "" || this.productlist[0].prodCode == undefined)
    {
      this.toastr.error("Please write product code.");
      this.count++;
      this.onEnterTableInput(0);
    }
    else if(this.productlist[0].prodName == "" || this.productlist[0].prodName == undefined)
    {
      this.toastr.error("Please write product name.");
      this.count++;
      this.onEnterTableInput(1);
    }
    else if(this.productlist[0].prodGrpID == "" || this.productlist[0].prodGrpID == undefined)
      {
        this.toastr.error("Please Select Category.");
      }
    else
    {
      if(this.productlist[0].purchRate == null) {this.productlist[0].purchRate = 0}
      if(this.productlist[0].sellRate == null) {this.productlist[0].sellRate = 0}
      if(this.productlist[0].minQty == null) {this.productlist[0].minQty = 0}
      if(this.productlist[0].maxQty == null) {this.productlist[0].maxQty = 0}
      this.productlist[0].comID = localStorage.getItem('comID');
      this.productlist[0].descr = this.selectedType;
      this.productlist[0].isRaw = false;
      this.productlist[0].minQty = parseFloat(this.productlist[0].minQty);
      this.productlist[0].maxQty = parseFloat(this.productlist[0].maxQty);
      this.productlist[0].mega = true;
      this.productlist[0].active = true;
      this.productlist[0].purchRate = parseFloat(this.productlist[0].purchRate);
      this.productlist[0].sellRate = parseFloat(this.productlist[0].sellRate);
      if(this.productlist[0].qty==undefined || this.productlist[0].qty=='')
      {
        this.productlist[0].qty = 0;
      }
      this.productlist[0].qty = parseFloat(this.productlist[0].qty);


      this.productlist[0].ProductBarCodes = this.productlist[0].ProductBarCodes.filter(element => {
        return !(element.Qty == 0 || element.Unit == "");
      });
      console.log(this.productlist[0])
      this.savebtnDisable = true;
      this.productService.saveProduct(this.productlist[0]).subscribe({
        next: (prd:any) => {
          this.sharedDataService.updateProducts$(prd);
          if(this.EditProdID == undefined)
          {
            this.toastr.success("Product has been successfully added!");
            this.router.navigateByUrl('/Manage/Products')
            this.clear();
          }
          else
          {
            this.toastr.success("Product has been successfully updated!");
            this.router.navigateByUrl('/Manage/Products')
          }

        },
        error: (response) => {
          console.log(response);
          this.toastr.error(response.error);
          this.onEnterTableInput(0);
          this.savebtnDisable = false;
        },
      });
    }
  }

  count = 0;

  increaseFocusIndexForProducts()
  {
    this.count++;
  }


  onEnterTableInput(index: number) {

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
    console.log("pressed");
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
  focusNextElement(currentElement: HTMLElement): void {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(document.querySelectorAll<HTMLElement>(focusableSelectors));

    const currentIndex = focusableElements.indexOf(currentElement);
    if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
        const nextElement = focusableElements[currentIndex + 1];
        nextElement.focus();
    }
}
  dailogType : string = "";
  openDialog(event: MouseEvent | KeyboardEvent, isKey: boolean, dialogType: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (isKey && !(event as KeyboardEvent).altKey) {
      if (keyboardEvent.key === 'Tab') {    
        this.focusNextElement(event.target as HTMLElement);
        return;
    }
    else{
      return;
    
    }
    }

    this.dailogType = dialogType;
    const permissionKey = this.getPermissionKey(dialogType);
    const visibilityKey = this.getVisibilityKey(dialogType);

    if (permissionKey && visibilityKey) {
      this.AuthService.checkPermission(permissionKey).subscribe((hasPermission) => {
        if (hasPermission) {
          this[visibilityKey] = true;
        } else {
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
  }

  private getPermissionKey(dialogType: string): string | null {
    const permissions: { [key: string]: string } = {
      supplier: 'SuppliersCreate',
      department: 'DepartmentCreate',
      category: 'CategoryCreate',
      manufacturer: 'ManufactureCreate',
      brand: 'ProductCategoryCreate',
    };
    return permissions[dialogType.toLowerCase()] || null;
  }

  private getVisibilityKey(dialogType: string): string | null {
    const visibilityKeys: { [key: string]: string } = {
      supplier: 'SupplierVisible',
      department: 'departmentVisible',
      category: 'categoryVisible',
      manufacturer: 'manufactureVisible',
      brand: 'brandVisible',
    };
    return visibilityKeys[dialogType.toLowerCase()] || null;
  }

  handleChildData(newItem: any): void {
    if (!newItem || !newItem.value) {
      this.closeDialog();
      return;
    }

    switch (this.dailogType) {
      case 'supplier':
        this.SelectedSupplier = newItem.value;
        this.productlist[0].vendID = newItem.value.vendID;
        this.closeDialog();
        break;
      case 'department':
        this.departmentList.push(newItem.value);
        this.departmentList = [...this.departmentList];
        this.productlist[0].depID = newItem.value.depID;
        this.closeDialog();
        break;
      case 'category':
        this.categoryList.push(newItem.value);
        this.SelectedCategory = newItem.value.categoryID;
        this.onDepartmentChange(this.productlist[0].depID,this.SelectedCategory);
        this.closeDialog();
        break;
      case 'manufacturer':
        this.prodManufactureList.push(newItem.value);
        this.productlist[0].prodManuID = newItem.value.prodManuID;
        this.closeDialog();
        break;
      case 'brand':
        this.productGrouplist.push(newItem.value);
        console.log(newItem.data);
        console.log(newItem.data);
        this.productlist[0].prodGrpID = newItem.value.prodGrpID;
        this.closeDialog();
        break;
      default:
        console.warn('Unknown item :', newItem);
        break;
    }
  }

  closeDialog(): void {
    switch (this.dailogType) {
      case 'supplier':
        this.SupplierVisible = false;
        break;
      case 'department':
        this.departmentVisible = false;
        break;
      case 'category':
        this.categoryVisible = false;
        break;
      case 'manufacturer':
        this.manufactureVisible = false;
        break;
      case 'brand':
        this.brandVisible = false;
        break;
      default:
        console.warn('Unknown dialog type:', this.dailogType);
        break;
    }
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


  onSupplierSelect(event: any) {
    this.productlist[0].vendID = event.vendID; // Assign only vendID to the target field
    console.log('Updated vendID:', this.productlist[0].vendID); // Log the assigned vendID
    this.productlist[0].sharePercentage = this.Supplierlist.find(x=>x.vendID == this.productlist[0].vendID).sharePercentage || 0;
  }

  async checkExistence(field: string, fieldID: any, index: number = 0, isCode:boolean) {
    console.log(index);
    if (field != undefined && field != "") {
      try {
        const result = await lastValueFrom(this.productService.IsBarcodeExist(field, this.productlist[0].prodID ?? 0));
        if (result) {
          this.toastr.error("This barcode already exists.");
          if (isCode) {
            this.productlist[0].prodCode = "";
            this.productlist[0].ProductBarCodes[index].BarCode = this.productlist[0].prodCode;

            this.focusOnTableInput(1);
          } else {
            const i = this.productlist[0].ProductBarCodes.findIndex((product: any) => product.BarCode === field);
            this.productlist[0].ProductBarCodes[i].BarCode = "";
          }
        }else{
          this.productlist[0].ProductBarCodes[index].BarCode = this.productlist[0].prodCode;
        }
      } catch {
        this.toastr.error("An error occurred while checking the code/barcode.");
        this.productlist[0].prodCode = "";
      }
    }
  }

  filterSuppliers(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSuppliers = this.Supplierlist.filter(
      (supplier) =>
        supplier.vendName.toLowerCase().includes(query) ||
        supplier.vendCode.toLowerCase().includes(query)
    );
  }
}
