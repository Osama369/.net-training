import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  constructor(private layoutService: LayoutService){
    this.layoutService.state.staticMenuDesktopInactive = true;
  }
}
