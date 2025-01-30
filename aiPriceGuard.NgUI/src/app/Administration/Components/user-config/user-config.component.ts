import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit {
 
  filterRole:any[]=[];
  roleList : any[] = [];
  SelectedRole :any;
  SelectedLocation :any = {};
  locations:Location[];
  firstName:string;
  lastName:string;
  emailAddress:string;
  mobile:string;

  constructor(private genericService: GenericService,
     private sharedDataService: SharedDataService,
     private userService:UserService
  ){

  }
  async ngOnInit() {
    this.roleList = await lastValueFrom(this.genericService.getAllRoles());
    this.filterRole = this.roleList;
    // this.locations = await lastValueFrom(this.sharedDataService.getLocations$());
    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 4);
      }
    })
  }
  filtersRole(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.roleList.length; i++) {
        let type = this.roleList[i];
        if (type.RoleName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.filterRole = filtered;
  }
  save(){
    
  }
}
