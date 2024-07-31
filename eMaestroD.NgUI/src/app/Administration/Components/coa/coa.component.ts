import { Component, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { ThisReceiver } from '@angular/compiler';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { TreeTable } from 'primeng/treetable';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { TranslationService } from 'src/app/Shared/Services/translation.service';
import { COA } from '../../Models/COA';
import { CoaService } from '../../Services/coa.service';

@Component({
  selector: 'app-coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.css']
})
export class COAComponent {
  constructor(
    private router: Router,
    private coaService:CoaService,
    private route: ActivatedRoute,
    private location: Location,
    private translationService: TranslationService,
    private authService : AuthService,
    private toastr : ToastrService,
    public bookmarkService: BookmarkService,
  ) { }

  @ViewChild('dt1', { static: true }) treeTable: TreeTable;
  heading:any = "Chart of Accounts";
  coaList: COA[];
  listofCOA: COA[];
  files: TreeNode[];
  AddNewCoaVisibility: boolean = false;
  title : any = "";
  coaData: COA[] = [];
  parentID : any = "";
  IsEdit : Boolean = false;
  selectedRow:any;

  bookmark : boolean = false;

  ngOnInit(): void {

   this.SetCoaTableTree();

   this.coaService.getAllCOA().subscribe({
    next: (coa) => {
      this.listofCOA = coa;
    }
  });

  this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
    this.bookmark = x;
  });

  }

  UpdateBookmark(value:any){
    this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
      next: (result: any) => {
        this.bookmark = value;
      },
    });;
  }

  changeLanguage(lang: string): void {
    this.translationService.useLanguage(lang);
  }

  SetCoaTableTree()
  {
    this.coaService.getAllCOAForGird().subscribe(acc => {
      this.coaList = acc;
      this.files = [];
      this.coaList.forEach(element => {
        this.files.push(
          {
            data:{"id":element.COAID,"name":element.acctName,"level":element.COAlevel},
            children:[]
          })

          element.children.forEach((elem:any) => {
            this.files.find(x=>x.data.name==element.acctName)?.children?.push({
              data:{"id":elem.COAID,"name":elem.acctName,"level":elem.COAlevel},
              children:[]
            })

            elem.children.forEach((el:any) => {
              this.files.find(x=>x.data.name==element.acctName)?.children?.find(x=>x.data.name==elem.acctName)?.children?.push({
                data:{"id":el.COAID,"name":el.acctName,"level":el.COAlevel},
                children:[]
              })

              el.children.forEach((e:any) => {
                this.files.find(x=>x.data.name==element.acctName)?.
                children?.find(x=>x.data.name==elem.acctName)?.
                children?.find(x=>x.data.name==el.acctName)?.
                children?.push({
                  data:{"id":e.COAID,"name":e.acctName,"level":e.COAlevel},
                  children:[]
                })

                e.children.forEach((e1:any) => {
                  this.files.find(x=>x.data.name==element.acctName)?.
                  children?.find(x=>x.data.name==elem.acctName)?.
                  children?.find(x=>x.data.name==el.acctName)?.
                  children?.find(x=>x.data.name==e.acctName)?.
                  children?.push({
                    data:{"id":e1.COAID,"name":e1.acctName,"level":e1.COAlevel},
                    children:[]
                  })

                });
              });
          });
        });
      });
    });
  }
  hide()
  {
    this.parentID = "";
    this.selectedRow = null;
  }
  handleChildData(data: any) {
   if(data.type == 'added')
    {
        this.SetCoaTableTree();
        this.AddNewCoaVisibility = false;
    }
    else
    {
        this.AddNewCoaVisibility = false;
    }
}


onAdd()
{
  this.authService.checkPermission('ChartOfAccountsCreate').subscribe(x=>{
    if(x)
    {
      if(this.parentID != "")
      {
        this.title = "Add New COA";
        this.IsEdit = false;
        this.AddNewCoaVisibility = true;
      }
      else{
        this.toastr.error("Select Any Account.");
       }

    }
    else{
      this.toastr.error("Unauthorized Access! You don't have permission to access.");
    }
  });


}
OnEdit()
{

  this.authService.checkPermission('ChartOfAccountsEdit').subscribe(x=>{
    if(x)
    {
      if(this.parentID != "")
      {
        this.title = "Update COA";
        this.IsEdit = true;
        this.AddNewCoaVisibility = true;
      }
      else{
        this.toastr.error("Select Any Account.");
       }

    }
    else{
      this.toastr.error("Unauthorized Access! You don't have permission to access.");
    }
  });

}

onDelete()
{
  this.authService.checkPermission('ChartOfAccountsDelete').subscribe(x=>{
    if(x)
    {
      if(this.parentID != "")
      {
        let list = this.listofCOA.find(x=>x.COAID == this.parentID);
          if(list != undefined)
            if(list.isSys != true)
            {
                this.coaService.deleteCOA(list.COAID).subscribe({
                  next : (value) => {
                    this.SetCoaTableTree();
                    this.toastr.success("Chart of account has been successfully deleted!");
                  },
                  error: (err) => {
                    this.toastr.error("Something Went Wrong...");
                  },
                });
            }
            else
            {
              this.toastr.error("Can't Delete System Account.");
            }
      }
      else{
       this.toastr.error("Select Any Account.");
      }
    }
    else{
      this.toastr.error("Unauthorized Access! You don't have permission to access.");
    }
  });

}
public expandAll(): void {
  const temp = _.cloneDeep(this.files);
  temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, true);
  });
  this.files = temp;
}

public collapseAll(): void {
  const temp = _.cloneDeep(this.files);
  temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, false);
  });
  this.files = temp;
}

private expandCollapseRecursive(node: TreeNode, isExpand: boolean): void {
  node.expanded = isExpand;
  if (node.children) {
      node.children.forEach(childNode => {
          this.expandCollapseRecursive(childNode, isExpand);
      });
  }
}

nodeSelect(event: any) {
  this.parentID = event.node.data.id;
}

nodeUnselect(event: any) {
  this.parentID = "";
}


}

export interface TreeNode {
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  expanded?: boolean;
}
