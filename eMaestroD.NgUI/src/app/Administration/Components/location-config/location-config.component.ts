import { Component, OnInit, Output ,EventEmitter  } from '@angular/core';
import { LocationService } from '../../Services/location.service';
import { lastValueFrom } from 'rxjs';
import { SharedDataResolver } from 'src/app/Shared/Resolver/shared-data.resolver';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { ToastrService } from 'ngx-toastr';

// import { privateDecrypt } from 'crypto';

@Component({
  selector: 'app-location-config',
  templateUrl: './location-config.component.html',
  styleUrls: ['./location-config.component.scss']
})
export class LocationConfigComponent implements OnInit {

  @Output() showNextEvent2=new EventEmitter<number>();
  locationList:any[]=[];
  filterLocList:any[]=[];
  SelectedLocation:any;
  Location:Location;
  locationAddList: any[] = [];
  providedLocName:string;
  constructor(private sharedData:SharedDataService,
              private locationService:LocationService,
               private toastr: ToastrService
  ){}
  async ngOnInit(){
  
   this.locationList= await lastValueFrom(this.locationService.getAllLoc());
   this.locationList =this.locationList.filter(x=> x.LocTypeId ===4);
   this.filterLocList = this.locationList;
   console.log(this.locationList);
   
   this.locationAddList = [{
  }]
  
  }
  filterLocation(event: any) {
  
    this.filterLocList  = this.locationList.filter(loc =>
     loc.LocationName.toLowerCase().includes(event.query.toLowerCase())
  );
 
  }
  Save(){
    this.locationAddList[0].ParentLocationId = this.SelectedLocation.LocationId;
    this.locationAddList[0].LocationName =this.providedLocName ;
    this.locationAddList[0].LocTypeId = 5;
    this.locationAddList[0].active=1;
    this.locationAddList[0].comID =localStorage.getItem('comID');
    // console.log(this.locationList);
    // console.log('x',this.locationAddList[0]);
  
    this.locationService.saveLoc(this.locationAddList[0]).subscribe({
      next: (loc) => {
        // this.locationService.saveLoc(loc);        
          this.toastr.success("Location has been successfully added");
          this.showNextEvent2.emit(3);
        // else
        // {
        //   this.toastr.success("Location has been successfully updated");
        //   this.dataEvent.emit({type:'added',value:loc});
        // }
      },
      error: (response) => {
        this.toastr.error(response.error);
        // this.onEnterTableInputCst(-1);
      },
    });
  }
    // this.parentLocationName = this.LocData.name;
}


