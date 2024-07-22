import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorize',
  templateUrl: './not-authorize.component.html',
  styleUrls: ['./not-authorize.component.scss']
})
export class NotAuthorizeComponent {
  constructor(private layoutService:LayoutService)
  {
   // this.layoutService.state.staticMenuDesktopInactive = true;
  }
}
