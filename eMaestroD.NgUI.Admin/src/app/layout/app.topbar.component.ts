import { filter } from 'rxjs';
import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  constructor(
    public layoutService: LayoutService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    public auth:AuthService,
    ) {}
    path = environment.logoPath;

    // changeLangage(lang: string) {
    //   // let htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    //   // htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    //   this.translateService.setDefaultLang(lang);
    //   this.translateService.use(lang);
    // }
    ngOnInit(): void {

    }

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    logout(){
      this.auth.removeToken();
      this.auth.canAccess();
      this.router.navigate(['/login']);
        //remove token
    }

}
