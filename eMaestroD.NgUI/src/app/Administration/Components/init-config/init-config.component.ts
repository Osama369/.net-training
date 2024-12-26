import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-init-config',
  templateUrl: './init-config.component.html',
  styleUrls: ['./init-config.component.scss']
})
export class InitConfigComponent {
  // ShowCompanyForm:boolean =false;
  ShowCompanyForm:boolean =false;

  ShowLocationForm:boolean =false;
  ShowUserForm:boolean =true;

constructor(  private layoutService: LayoutService){
  layoutService.state.staticMenuDesktopInactive =true;
}


ShowNext(event:number){
   
  if(event ===2)
  {
    this.ShowCompanyForm =false;
    this.ShowLocationForm =true;
  }else if(event===3){
    this.ShowLocationForm =false;
    this.ShowUserForm=true;
  }
}
}
