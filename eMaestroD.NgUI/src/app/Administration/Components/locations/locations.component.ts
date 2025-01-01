import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { TreeTable } from 'primeng/treetable';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { LocationService } from '../../Services/location.service';
import { Location } from './../../Models/location';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  @ViewChild('dt1', { static: true }) treeTable: TreeTable;
  heading: any = "Locations";
  locList: Location[];
  AlllocList: Location[];
  files: TreeNode[];
  AddNewLocationVisibility: boolean = false;
  title: any = "";
  locationData: Location[] = [];
  parentID: any = "";
  IsEdit: boolean = false;
  selectedRow: any;
  bookmark: boolean = false;
  flag: any;
  dragProviceID: number;
  onDropRegionID: number;
  constructor(
    private router: Router,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    public bookmarkService: BookmarkService
  ) { }

  ngOnInit(): void {
    this.SetLocationTableTree();

    // this.locationService.getAllLoc().subscribe({
    //   next: (loc) => {
    //     this.locList = loc;
    //   }
    // });

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
  ShowlocationType(level:number){
   
        if(level===1){
          this.flag= 'Country';
        }
        else if(level===2){
          this.flag ='Region';
        }
      else if(level===3){
        this.flag ='Province';
        }
      else if(level===4){
        this.flag ='City';
        }
      else if(level===5){
       this.flag = "Area";
        }
        return this.flag;
        
  }

  SetLocationTableTree() {

    this.locationService.getAllLoc().subscribe(loc => {
      if(this.AlllocList==undefined || this.AlllocList.length<loc.length){
        this.locList = this.AlllocList = loc.sort((a, b) => a.LocTypeId - b.LocTypeId);
        this.files = this.convertToTree(loc);
        this.expandAll();

      }
   
    });
   
  }

  convertToTree(locations: any[]): any[] {
    const map = new Map<number, any>();
    const roots: any[] = [];

    locations.forEach(loc => {
      const node = {
        data: { "id": loc.LocationId, "name": loc.LocationName, "level": loc.LocTypeId, "parentlocID" : loc.ParentLocationId },
        children: []
      };
      map.set(loc.LocationId, node);

      if (loc.ParentLocationId === 0) {
        roots.push(node);
      } else {
        const parent = map.get(loc.ParentLocationId);
        if (parent) {
          parent.children.push(node);
        } else {
          map.set(loc.ParentLocationId, { children: [node] });
        }
      }
    });

    return roots;
  }

  hide() {
    this.parentID = "";
    this.selectedRow = null;
  }

  handleChildData(data: any) {
    // if (data.type == 'added') {
    //   this.SetLocationTableTree();
    //   this.AddNewLocationVisibility = false;
    // } 
    // // else if(data.type=="addMore"){
    // //   this.SetLocationTableTree();
    // // }
    // else {
    //   this.AddNewLocationVisibility = false;
    // }

    this.SetLocationTableTree();
    this.AddNewLocationVisibility = false;
  }

  onAdd() {
    this.authService.checkPermission('LocationCreate').subscribe(x => {
      if (x) {
        if (this.parentID != "") {
          console.log(this.selectedRow);
          const selectedLevel = this.selectedRow.data.level;
          if (selectedLevel === 1 || selectedLevel === 4) {
            this.title = "Add New Location";
            this.IsEdit = false;
            this.AddNewLocationVisibility = true;
            this.locList = this.selectedRow.data;
          } else {
            this.toastr.error("Only Regions or Areas can be added!");
          }
        } else {
          this.toastr.error("Select Any Location.");
        }
      } else {
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });
  }

  onEdit() {
    this.authService.checkPermission('LocationEdit').subscribe(x => {
      if (x) {
        if (this.parentID != "") {
          console.log(this.selectedRow);
          const selectedLevel = this.selectedRow.data.level;
          if (selectedLevel === 2 || selectedLevel === 5) {
            this.title = "Update Location";
            this.IsEdit = true;
            this.AddNewLocationVisibility = true;
            const parentName = this.AlllocList.find(loc => loc.LocationId == this.selectedRow.data.parentlocID).LocationName;
            this.selectedRow.data = {...this.selectedRow.data, parentName : parentName}
            console.log(this.selectedRow.data);
            this.locList = this.selectedRow.data;
          } else {
            this.toastr.error("Only Regions and Areas can be edited!");
          }
        } else {
          this.toastr.error("Select Any Location.");
        }
      } else {
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });
  }

  onDelete() {
   
    // if(x.)
    //   this.toastr.error("Cannot delete this location because it has level 3 locations under it.");
    // let filterList = this.files.filter(x=> )
   
    this.authService.checkPermission('LocationDelete').subscribe(x => {
      if (x) {
       
        if (this.parentID != "") {
        
          const selectedLocation = this.AlllocList.find(loc => loc.LocationId == this.parentID);

          if (selectedLocation) {
            const selectedLevel = selectedLocation.LocTypeId;

            // Check if the location is at level 2 or 5
            if (selectedLevel === 2 || selectedLevel === 5) {

              // For level 2, ensure there are no level 3 locations under it
              if (selectedLevel === 2) {
                const hasLevel3Children = this.AlllocList.some(loc => loc.ParentLocationId == this.parentID && loc.LocTypeId == 3);

                if (hasLevel3Children) {
                  this.toastr.error("Cannot delete this location because it has level 3 locations under it.");
                  return;
                }
              } else if(selectedLevel === 5){
                const hasLevel5Children = this.AlllocList.filter(loc => loc.LocTypeId == 5);

                if (hasLevel5Children.length == 1) {
                  this.toastr.error("Cannot delete this location because only one location exist.");
                  return;
                }
              }

              if (confirm("Are you sure you want to delete this Location?")) {
               
                
                  this.locationService.deleteLoc(selectedLocation.LocationId).subscribe({
                    next: x => {
                      this.toastr.success("Location has been successfully deleted!");
                      this.SetLocationTableTree();
                    },
                    error: err => {
                      this.toastr.error(err.error);
                    }
                  });
              }
            } else {
              this.toastr.error("Only Regions or Areas can be deleted!");
            }
          } else {
            this.toastr.error("Select Any Location.");
          }
        } else {
          this.toastr.error("Select Any Location.");
        }
      } else {
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });
  }

  expandAll() {
    const temp = _.cloneDeep(this.files);
    temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, true);
    });
    this.files = temp;
  }

  collapseAll() {
    const temp = _.cloneDeep(this.files);
    temp.forEach((node: TreeNode) => {
      this.expandCollapseRecursive(node, false);
    });
    this.files = temp;
  }

  expandCollapseRecursive(node: TreeNode, isExpand: boolean) {
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


  onDragStart(event: DragEvent, rowData: any): void {
    if (rowData.level !== 3) {
        event.preventDefault();
        console.warn('Only level 3 rows can be dragged');
    } else {
        event.dataTransfer?.setData('text/plain', JSON.stringify(rowData));
      //  console.log(`Dragging row: ${rowData.name}`);
        this.dragProviceID= rowData.id
        console.log(`Dragging locId: ${rowData.id}`);
        console.log(`provice ID :${this.dragProviceID}`);

    }
}

onDragOver(event: DragEvent, rowData: any): void {
    if (rowData.level === 2) {
        event.preventDefault(); // Allow drop
        console.log(`Row: ${rowData.name} is droppable`);
        this.onDropRegionID= rowData.id

        console.log(`Drop LocID: ${rowData.id } is droppable`);
        console.log(`Region ID : ${this.onDropRegionID} is on dropped`);

    }
}

onDrop(event: DragEvent, targetRowData: any): void {
    const draggedData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
    if (targetRowData.level === 2 && draggedData.level === 3) {
        console.log(`Dropped row: ${draggedData.name} onto ${targetRowData.name}`);
        // Perform necessary updates to your data
        this.locationService.ReplaceParentLoc(this.dragProviceID, this.onDropRegionID).subscribe({
          next: (loc) => {
            this.toastr.success("Lacation has been Moved Successfully.");
            this.AlllocList=[];
            this.SetLocationTableTree();
  
          },
          error: (response) => {
            this.toastr.error(response.error);
            
          },
        });
       
    } else {
       // console.warn('Invalid drop operation');
    }
}

  

  onNodeDrop(event: any): void {
    const draggedNode = event.dragNode.data;
    const targetNode = event.dropNode.data;

    if (draggedNode.level === 3 && targetNode.level === 2) {
        // Handle the drop logic here
        console.log('Dropped', draggedNode, 'onto', targetNode);

        // Example: Add the dragged node as a child of the target node
        if (!event.dropNode.children) {
            event.dropNode.children = [];
        }
        event.dropNode.children.push(event.dragNode);
        event.dropNode.expanded = true; // Expand the target node to show the new child

        // Remove the node from its previous parent (optional)
        const parent = event.dragNode.parent;
        if (parent) {
            const index = parent.children.indexOf(event.dragNode);
            if (index !== -1) {
                parent.children.splice(index, 1);
            }
        }
    } else {
        // Invalid drop
        console.warn('Invalid drop: Level 3 can only be dropped onto Level 2');
    }
  }

}
