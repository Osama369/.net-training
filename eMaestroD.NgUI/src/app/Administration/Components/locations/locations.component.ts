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

  SetLocationTableTree() {
    this.locationService.getAllLoc().subscribe(loc => {
      this.locList = this.AlllocList = loc;
      this.files = this.convertToTree(loc);
      this.expandAll();
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
    if (data.type == 'added') {
      this.SetLocationTableTree();
      this.AddNewLocationVisibility = false;
    } else {
      this.AddNewLocationVisibility = false;
    }
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
            this.toastr.error("You can only add a location at level 1 or 4.");
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
            this.toastr.error("You can only edit a location at level 2 or 5.");
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
    this.authService.checkPermission('LocationDelete').subscribe(x => {
      if (x) {
        if (this.parentID != "") {
          console.log(this.selectedRow);
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
              this.toastr.error("You can only delete locations at level 2 or 5.");
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

}
